import pandas as pd
import numpy as np
from risk_engine.src.constants import YEAR_IN_SECONDS

def index_to_rate(self, oracle: pd.DataFrame, lookback: int) -> pd.DataFrame:
    '''
    For when we need to convert the liquidity index in a rate oracle to real rate, for the purposes of bootstrapping.
    '''

    # Convert rate to an integer
    floating_rni: list[float] = []
    # todo: below check looks hacky
    oracle = oracle[oracle[self.market_name] != "-1"]  # Edge case where a -1 is recorded as a liquidity index
    for rni in oracle[self.market_name]:
        float_rni = rni if isinstance(rni, float) else rni[:-27] + "." + rni[-27:]
        floating_rni.append(float(float_rni))
    oracle[self.market_name] = np.array(floating_rni)
    self.data_name = "apy"  # Update the data name to include the rate
    apys = []
    for i in range(len(oracle)):
        window = i - lookback if lookback < i else 0
        variable_factor = oracle.iloc[i][self.market_name] / oracle.iloc[window][self.market_name] - 1
        compounding_periods = YEAR_IN_SECONDS / (
                oracle.iloc[i]["timestamp"] - oracle.iloc[window]["timestamp"]
        )
        apys.append(((1 + variable_factor) ** compounding_periods) - 1)
    oracle[self.data_name] = apys
    return oracle