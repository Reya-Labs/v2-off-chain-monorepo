import unittest
from risk_engine.src.oracle_simulator.utils.liquidityIndexToApy import liquidity_index_to_apy_series
from risk_engine.src.oracle_simulator.utils.resampleLiquidityIndex import resample_liquidity_index
import pandas as pd
from risk_engine.src.constants import DEFAULT_APY_LOOKBACK_IN_DAYS
from pandas import Series

class TestLiquidityIndexToAPY(unittest.TestCase):

    def setUp(self):

        self.liquidity_index_df = pd.read_csv('../../../mocks/data/mock_ausdc_borrow_rate.csv')

    def test_liquidity_index_to_apy(self):

        liquidity_index_df_interpolated = resample_liquidity_index(liquidity_index_df=self.liquidity_index_df, resampling_frequency='1D')

        liquidity_index_to_apy_series(
            liquidity_index_df=liquidity_index_df_interpolated,
            lookback_in_days=1
        )
