import pandas as pd
import numpy as np
from risk_engine.src.constants import YEAR_IN_SECONDS
from risk_engine.src.oracle_simulator.utils.resampleLiquidityIndex import resample_liquidity_index

def apy(previous, current, dt):
    """
    Function to calculate APY given previous and current liquidity index values,
    and the time difference in seconds.
    """
    rate = (current / previous) - 1  # rate of return
    periods_per_year = YEAR_IN_SECONDS / dt  # seconds per year
    apy = (1 + rate) ** periods_per_year - 1  # annualize rate
    return apy

def liquidity_index_to_apy_series(liquidity_index_df: pd.DataFrame, lookback_in_days: int) -> pd.Series:
    '''
    Shape of expected input, note liquidity index is resampled to be daily and descaled
                             liquidityIndex
    2023-02-16 03:11:49        1.009907
    2023-02-17 03:11:49        1.009935
    '''


    liquidity_index_df.loc[:, 'liquidityIndexLagged'] = liquidity_index_df.loc[:, 'liquidityIndex'].shift(lookback_in_days, fill_value=np.nan)
    liquidity_index_df.loc[:, 'return'] = liquidity_index_df.loc[:, "liquidityIndex"].div(liquidity_index_df.loc[:, "liquidityIndexLagged"]) - 1

    apy = ((1+liquidity_index_df.loc[:, 'return']) ** 365) - 1

    return apy