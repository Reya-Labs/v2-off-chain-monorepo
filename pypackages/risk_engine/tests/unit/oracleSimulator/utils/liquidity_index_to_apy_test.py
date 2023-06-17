import unittest
from risk_engine.src.oracle_simulator.utils.liquidityIndexToApy import liquidity_index_series_to_apy_series
import pandas as pd
from risk_engine.src.constants import DEFAULT_APY_LOOKBACK_IN_SECONDS
from pandas import Series

class TestLiquidityIndexToAPY(unittest.TestCase):

    def setUp(self):

        self.df = pd.read_csv('../../../mocks/data/mock_ausdc_borrow_rate.csv')

    def test_liquidity_index_to_apy(self):

        liquidity_index: Series = self.df.loc[:, "liquidityIndex"]
        timestamps: Series = self.df.loc[:, "timestamp"]

        liquidity_index_series_to_apy_series(
            liquidity_index=liquidity_index,
            timestamps=timestamps,
            lookback_in_seconds=DEFAULT_APY_LOOKBACK_IN_SECONDS
        )


