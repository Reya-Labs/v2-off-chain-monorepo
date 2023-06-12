import unittest

from risk_engine.src.constants import MONTH_IN_SECONDS
from risk_engine.src.evm.block import Block
from risk_engine.src.exchanges.vamm.datedIRSVAMMExchange import DatedIRSVAMMExchange
from risk_engine.tests.mocks.mockOracle import MockOracle


class TestIRSPool(unittest.TestCase):
    def setUp(self):
        self.block = Block(relative_block_position=0)
        self.mock_oracle = MockOracle()

        self.maturity = self.block.timestamp + MONTH_IN_SECONDS

        self.pool = DatedIRSVAMMExchange(
            pool_id="USDC",
            block=self.block,
            min_tick=0,
            max_tick=100000,
            tick_spacing=10,
            term_end_in_seconds=self.maturity,
            oracle=self.mock_oracle,
        )

        self.pool.initialize(current_tick=5000)

    def test_price_at_tick(self):
        self.assertAlmostEqual(self.pool.price_at_tick(1000), 0.01)
        self.assertAlmostEqual(self.pool.price_at_tick(5000), 0.05)
        self.assertAlmostEqual(self.pool.price_at_tick(10000), 0.1)

    def test_tick_at_price(self):
        self.assertAlmostEqual(self.pool.tick_at_price(0.01), 1000)
        self.assertAlmostEqual(self.pool.tick_at_price(0.01001), 1000)
        self.assertAlmostEqual(self.pool.tick_at_price(0.05), 5000)
        self.assertAlmostEqual(self.pool.tick_at_price(0.1), 10000)

    def test_track(self):
        self.mock_oracle.mock_latest(return_value=1.6)

        variable_tokens = self.pool._track(
            index_tracker=0, base=10000, tick_lower=3000, tick_upper=7000
        )

        fixed_tokens = self.pool._track(
            index_tracker=1, base=10000, tick_lower=3000, tick_upper=7000
        )

        self.assertAlmostEqual(variable_tokens, 10000)
        self.assertAlmostEqual(fixed_tokens, -16065.753424657532)


if __name__ == "__main__":
    unittest.main()
