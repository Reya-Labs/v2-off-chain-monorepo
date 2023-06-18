import random
from dataclasses import dataclass
from typing import Optional

import numpy as np
from risk_engine.src.oracle_simulator.oracleForecaster import OracleForecaster
import pandas as pd
from arch.bootstrap import (
    CircularBlockBootstrap,
    StationaryBootstrap,
    optimal_block_length,
)

from risk_engine.src.constants import DAY_IN_SECONDS


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


    def forecast_oracle(self, oracle: pd.DataFrame, iterations: int = 10, lookback: int = 50) -> list[float]:
        covariance = np.array(oracle[self.data_name].std())
        model = OracleForecaster(covariance_matrix=covariance, X=oracle)

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