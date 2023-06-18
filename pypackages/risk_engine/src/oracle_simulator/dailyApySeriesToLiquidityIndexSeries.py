import pandas as pd
from risk_engine.src.oracle_simulator.helpers import cumprod

def daily_apy_series_to_liquidity_index_series(apy: pd.Series):

    liquidity_index = cumprod(1+apy/356)

    return liquidity_index

