import pandas as pd
import numpy as np
from risk_engine.src.constants import YEAR_IN_SECONDS

def apy(previous, current, dt):
    """
    Function to calculate APY given previous and current liquidity index values,
    and the time difference in seconds.
    """
    rate = (current / previous) - 1  # rate of return
    periods_per_year = YEAR_IN_SECONDS / dt  # seconds per year
    apy = (1 + rate) ** periods_per_year - 1  # annualize rate
    return apy

def liquidity_index_series_to_apy_series(self, liquidity_index: pd.Series, timestamps: pd.Series, lookback: int) -> pd.Series:
    # First, scale the liquidity index
    liquidity_index_scaled: pd.Series = liquidity_index.astype(float) / 10 ** 27

    # Then, compute differences in timestamps
    timestamp_diffs = timestamps.diff()

    # Create a new DataFrame to hold liquidity index and timestamp differences
    df = pd.DataFrame({
        'liquidity_index': liquidity_index_scaled,
        'timestamp_diff': timestamp_diffs
    })

    # Use the rolling window function to calculate APY for each window
    apy_series = df.rolling(window=lookback, min_periods=1).apply(lambda window: apy(window['liquidity_index'].iloc[0], window['liquidity_index'].iloc[-1], window['timestamp_diff'].sum()), raw=True)

    return apy_series
