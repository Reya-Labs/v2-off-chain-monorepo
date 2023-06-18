import unittest
from risk_engine.src.oracle_simulator.rescaleVolatilityFromLogNormal import rescale_volatility_from_log_normal
from risk_engine.src.oracle_simulator.dailyLiquidityIndexToApySeries import daily_liquidity_index_to_apy_series
from risk_engine.src.oracle_simulator.resampleLiquidityIndex import resample_liquidity_index
import pandas as pd
import numpy as np

class RescaleVolatilityFromLogNormalTest(unittest.TestCase):

    def setUp(self):
        np.random.seed(42)

        self.liquidity_index_df = pd.read_csv('../../mocks/data/mock_ausdc_borrow_rate.csv')

    def test_rescale_volatility_from_log_normal(self):

        daily_liquidity_index_df_interpolated = resample_liquidity_index(liquidity_index_df=self.liquidity_index_df, resampling_frequency='1D')

        apy_series = daily_liquidity_index_to_apy_series(
            liquidity_index_df=daily_liquidity_index_df_interpolated,
            lookback_in_days=1
        )

        self.assertAlmostEqual(apy_series.loc['2023-02-17 03:11:49'], 0.010201055942560266)

        log_scaled_apy = rescale_volatility_from_log_normal(apy=apy_series, scale=0.5)

        self.assertAlmostEqual(log_scaled_apy.loc['2023-02-21 03:11:49'], 0.04226725081997701)