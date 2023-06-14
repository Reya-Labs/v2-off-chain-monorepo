import random
from dataclasses import dataclass
from math import ceil
from typing import Optional

import numpy as np
import OracleForecaster as of
import pandas as pd
from arch.bootstrap import (
    CircularBlockBootstrap,
    StationaryBootstrap,
    optimal_block_length,
)
from globals import SECONDS_IN_YEAR, oracle_hash


@dataclass
class Observation:
    timestamp: int
    rate: float


class OracleSimulator:

    # For now the design plan will be to assume that example Oracle data can be
    # fetched from a CSV, but ultimately this will need to be linked with either a
    # Chainlink oracle fetch or a DeFi protocol oracle fetch (e.g. Aave for a variable
    # rate oracle)

    def __init__(
        self,
        market_name: str,
        market_shock_parameters: Optional[list[float]] = None,
        market_vol_parameters: Optional[list[float]] = None,
        maturity: Optional[int] = None,  # I.e. the number of days
    ):
        self.market_name = market_name
        self.market_shock_parameters = market_shock_parameters
        self.market_vol_parameters = market_vol_parameters
        self.data_name = self.market_name
        self.maturity = maturity

    def get_oracle_data(self) -> pd.DataFrame:
        oracle = None
        if self.market_name not in oracle_hash.keys():
            raise Exception("Oracle data cannot be found. Please check market name.")

        oracle_call = oracle_hash[self.market_name]
        if oracle_call.split(".")[-1] == "csv":
            oracle = pd.read_csv(oracle_call)
        else:
            raise Exception("CSV format not correctly provided. Please investigated.")
        if oracle is None:
            raise Exception("Oracle data not correctly called. Please investigate.")
        # Oracle column naming conventions
        market = "liquidityIndex" if "liquidityIndex" in oracle.columns else "price"
        oracle.rename(columns={market: self.market_name}, inplace=True)

        if self.maturity is not None:
            SECONDS_IN_DAY = ceil(SECONDS_IN_YEAR / 365)
            pool_start = oracle.iloc[-1]["timestamp"] - self.maturity * SECONDS_IN_DAY
            oracle = oracle.loc[oracle["timestamp"] > pool_start]
        return oracle

    def get_oracle_volatility(
        self, oracle: pd.DataFrame, sampling_interval: Optional[list[int]] = None
    ) -> float:
        if sampling_interval is not None:
            oracle = oracle[sampling_interval[0] : sampling_interval[1]]
        return oracle[self.data_name].std() * np.sqrt(
            SECONDS_IN_YEAR / (oracle.iloc[-1]["timestamp"] - oracle.iloc[0]["timestamp"])
        )

    # For when we need to convert the liquidity index in a rate oracle to real rate, for the
    # purposes of bootstrapping.
    def index_to_rate(self, oracle: pd.DataFrame, lookback: int) -> pd.DataFrame:
        # Convert rate to an integer
        floating_rni = []
        oracle = oracle[
            oracle[self.market_name] != "-1"
        ]  # Edge case where a-1 is recorded as a liquidity index
        for rni in oracle[self.market_name]:
            float_rni = rni if isinstance(rni, float) else rni[:-27] + "." + rni[-27:]
            floating_rni.append(float(float_rni))
        oracle[self.market_name] = np.array(floating_rni)
        self.data_name = "apy"  # Update the data name to include the rate
        apys = []
        for i in range(len(oracle)):
            window = i - lookback if lookback < i else 0
            variable_factor = oracle.iloc[i][self.market_name] / oracle.iloc[window][self.market_name] - 1
            compounding_periods = SECONDS_IN_YEAR / (
                oracle.iloc[i]["timestamp"] - oracle.iloc[window]["timestamp"]
            )
            apys.append(((1 + variable_factor) ** compounding_periods) - 1)
        oracle[self.data_name] = apys
        return oracle

    @staticmethod
    def cumprod(lst: np.array) -> np.array:
        results = []
        cur = 1
        for n in lst:
            cur *= n
            results.append(cur)
        return results

    def rate_to_index(self, oracle: pd.DataFrame, name: str) -> pd.DataFrame:
        if name not in oracle.columns:
            raise Exception("Error -- no rate column to calculated index from. Please investigate.")
        oracle.loc[:, "liquidity_index"] = self.cumprod(1 + oracle.loc[:, name] / 365)
        return oracle

    @staticmethod
    def get_random() -> float:
        exp = random.randint(-5, -2)
        significand = 0.9 * random.random() + 0.1
        return significand * 10**exp

    def perform_block_bootstap(
        self, oracle: pd.DataFrame, n_replicates: int = 100, circular: bool = False
    ) -> list[float]:
        rs = np.random.RandomState(42)
        market_plus_epsilon = np.array([m + self.get_random() for m in oracle[self.market_name].values])

        # Optimal block lengths
        time_delta = optimal_block_length(market_plus_epsilon)["circular"].values[0]

        # Block bootstrapping
        m_bs = (
            CircularBlockBootstrap(block_size=int(time_delta) + 1, x=market_plus_epsilon, random_state=rs)
            if circular
            else StationaryBootstrap(block_size=int(time_delta) + 1, x=market_plus_epsilon, random_state=rs)
        )
        m_replicates = [data[1]["x"].flatten() for data in m_bs.bootstrap(n_replicates)]

        return m_replicates

    def rescale_volatility(
        self, scale: float, oracle: pd.DataFrame = None, volatility: Optional[float] = None
    ) -> float:
        if oracle is None:
            raise Exception("Need to specifiy an oracle.")
        if volatility is None:
            volatility = self.get_oracle_volatility(oracle)
        vol = scale * volatility

        # Now we need to apply this rescaled vol and generate a new market time series
        # Let's do this using a Z-score:
        # 1) Stationarise by taking a difference;
        # 2) Convert to Z-score;
        # 3) Apply new vol;
        # 4) Convert to new time series.
        oracle["temp"] = oracle[self.data_name].diff()
        oracle.dropna(inplace=True)
        oracle["z_score_rescaled"] = (oracle["temp"] - oracle["temp"].mean()) * vol / oracle["temp"].std()
        oracle[self.data_name] = oracle["z_score_rescaled"].cumsum()
        oracle.drop(columns=["temp", "z_score_rescaled"], inplace=True)

        return oracle

    def rescale_volatility_from_log_normal(self, scale: float, oracle: pd.DataFrame = None) -> float:
        if oracle is None:
            raise Exception("Need to specifiy an oracle.")
        oracle[self.data_name+f"_scaled_{scale}"] = [
            i * np.random.lognormal(1, np.sqrt(scale), 1)[0] for i in oracle[self.data_name].values
        ]
        return oracle

    # Simplistic model for introducing a market shock
    # Introduce a shock of magnitude +/- M at random time t
    # along the series, and apply linear interpolatiom from that point to the
    # neighbouring points in the time series
    def add_market_shock(
        self, oracle: pd.DataFrame, shock_values: list[float], interpolations: int = 2
    ) -> pd.DataFrame:
        dates = [
            random.randint(len(shock_values), len(oracle) - len(shock_values))
            for i in range(len(shock_values))
        ]
        oracle[self.data_name+"_shock"] = oracle[self.data_name] # Add in the separate shocked dataframe column
        for i, d in enumerate(dates):
            # Let's interpolate by first adding NaN values
            for diff in [i for i in range(-interpolations, interpolations + 1) if i != 0]:
                oracle[self.data_name+"_shock"].replace([oracle.iloc[d + diff][self.data_name+"_shock"]], np.nan, inplace=True)
            oracle[self.data_name+"_shock"].replace([oracle.iloc[d][self.data_name+"_shock"]], shock_values[i], inplace=True)
        # Now we linearly interpolate around the NaN values
        oracle.interpolate(method="linear", limit_direction="forward", inplace=True)
        return oracle

    def forecast_oracle(self, oracle: pd.DataFrame, iterations: int = 10, lookback: int = 50) -> list[float]:
        covariance = np.array(oracle[self.data_name].std())
        model = of.OracleForecaster(covariance_matrix=covariance, X=oracle)

        y_pred = []
        X_train, y_train = oracle[self.data_name].shift(-1).values, oracle[self.data_name].values
        for i in range(lookback, len(X_train)):
            for j in range(iterations):
                model.kalman_step(X_train[i - lookback : i], y_train[i - lookback : i])
            # Now we predict at step i
            F = np.insert(X_train[i, :], 0, 1.0, axis=0)
            yhat = F.dot(model.theta)
            y_pred.append(yhat)

        return y_pred

    def generate_csv(self, oracle: pd.DataFrame = None, name: Optional[str] = None):
        if oracle is None:
            raise Exception("Error, please specify oracle for writing to CSV.")
        if name is None:
            oracle.to_csv(self.data_name + "_OracleSimulator.csv")
        else:
            cols = ["timestamp", "liquidity_index", name] if "liquidity_index" in oracle.columns else ["timestamp", name]
            oracle_new = oracle[cols]
            oracle_new.rename(columns={name: "apy"}, inplace=True)
            oracle_new.to_csv(name + "_OracleSimulator.csv")

    def generate_observations(
        self, oracle: pd.DataFrame = None, name: Optional[str] = None
    ) -> list[Observation]:
        if oracle is None:
            raise Exception("Error, please specify oracle for generating the list of observations.")
        if name is None:
            return [
                Observation(timestamp=oracle.iloc[i]["timestamp"], rate=oracle.iloc[i][self.data_name])
                for i in range(len(oracle))
            ]
        return [
            Observation(timestamp=oracle.iloc[i]["timestamp"], rate=oracle.iloc[i][name])
            for i in range(len(oracle))
        ]