import unittest
from risk_engine.src.oracle_simulator.utils.dailyLiquidityIndexToApySeries import daily_liquidity_index_to_apy_series
from risk_engine.src.oracle_simulator.utils.resampleLiquidityIndex import resample_liquidity_index
import pandas as pd

class TestLiquidityIndexToAPY(unittest.TestCase):

    def setUp(self):

        self.liquidity_index_df = pd.read_csv('../../../mocks/data/mock_ausdc_borrow_rate.csv')

    def test_liquidity_index_to_apy(self):

        daily_liquidity_index_df_interpolated = resample_liquidity_index(liquidity_index_df=self.liquidity_index_df, resampling_frequency='1D')

        apy_series = daily_liquidity_index_to_apy_series(
            liquidity_index_df=daily_liquidity_index_df_interpolated,
            lookback_in_days=1
        )

        self.assertAlmostEqual(apy_series.loc['2023-02-17 03:11:49'], 0.010201055942560266)
