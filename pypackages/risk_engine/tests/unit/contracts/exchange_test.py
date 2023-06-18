import unittest
from unittest import mock

from risk_engine.src.constants import MONTH_IN_SECONDS
from risk_engine.src.evm.block import Block
from risk_engine.src.contracts.exchanges.vamm.baseVAMMExchange import BaseVAMMExchange


class MockPool(BaseVAMMExchange):
    def _track_variable_tokens(self, base):
        return base

    def _track_fixed_tokens(self, base, tick_lower, tick_upper):
        avg_price = (
            self.price_at_tick(tick_lower) + self.price_at_tick(tick_upper)
        ) / 2
        return -base * avg_price

    def price_at_tick(self, tick):
        return tick

    def tick_at_price(self, price):
        return self.closest_tick(price)


class TestIRSPool(unittest.TestCase):
    def setUp(self):
        self.block = Block(relative_block_position=0)

        self.maturity = self.block.timestamp + MONTH_IN_SECONDS

        self.pool = MockPool(
            pool_id="ETH",
            block=self.block,
            min_tick=0,
            max_tick=100000,
            tick_spacing=10,
            term_end_in_seconds=self.maturity,
        )

        self.pool.initialize(current_tick=1500)

        self.mock_positions()

    def mock_positions(self):
        self.pool._accounts.update(
            {"user": {"positions": ["user-12000-16000", "user-20000-21000"]}}
        )

        self.pool._positions.update(
            {
                "user-12000-16000": {
                    "account_id": "user",
                    "tick_lower": 12000,
                    "tick_upper": 16000,
                    "base": 100,
                    "accumulated": [10, -5],
                    "updated_growths": [4, 5],
                },
                "user-20000-21000": {
                    "account_id": "user",
                    "tick_lower": 20000,
                    "tick_upper": 21000,
                    "base": -50,
                    "accumulated": [-5, 0],
                    "updated_growths": [5, 5],
                },
            }
        )

    def test_supported_maturities(self):
        self.assertAlmostEqual(self.pool.supported_maturities(), [self.maturity])

    def test_get_account_filled_balances(self):
        self.pool.growth_between_ticks = mock.Mock(side_effect=[[6, 6], [4, 3]])

        base, quote = self.pool.get_account_filled_balances(
            maturity=self.maturity, account_id="user"
        )

        self.assertAlmostEqual(base, 5.1)
        self.assertAlmostEqual(quote, -4.875)

        self.assertAlmostEqual(
            self.pool._positions["user-12000-16000"]["updated_growths"], [6, 6]
        )

        self.assertAlmostEqual(
            self.pool._positions["user-20000-21000"]["updated_growths"], [4, 3]
        )

    def test_get_account_filled_and_unfilled_balances(self):
        self.pool.growth_between_ticks = mock.Mock(side_effect=[[6, 6], [4, 3]])

        self.pool.tracked_values_between_ticks = mock.Mock(
            side_effect=[([10, -1], [-5, 1]), ([30, -1], [-10, 1])]
        )

        (
            base,
            quote,
            unfilled_base_long,
            unfilled_base_short,
        ) = self.pool.get_account_filled_and_unfilled_balances(
            maturity=self.maturity, account_id="user"
        )

        self.assertAlmostEqual(base, 5.1)
        self.assertAlmostEqual(quote, -4.875)
        self.assertAlmostEqual(unfilled_base_long, 40)
        self.assertAlmostEqual(unfilled_base_short, -15)

        self.assertAlmostEqual(
            self.pool._positions["user-12000-16000"]["updated_growths"], [6, 6]
        )

        self.assertAlmostEqual(
            self.pool._positions["user-20000-21000"]["updated_growths"], [4, 3]
        )

    def test_execute_limit_order_non_existent(self):
        self.pool.growth_between_ticks = mock.Mock(side_effect=[[6, 6], [4, 3]])

        self.pool.tracked_values_between_ticks = mock.Mock(
            side_effect=[([10, -1], [-5, 1]), ([30, -1], [-10, 1])]
        )

        self.pool.vamm_mint = mock.Mock()

        executed_base_amount = self.pool.execute_limit_order(
            maturity=self.maturity,
            account_id="user",
            base=100,
            lower_price=14000,
            upper_price=16000,
        )

        self.assertEqual(executed_base_amount, 100)

        self.assertEqual(
            self.pool._positions["user-14000-16000"],
            {
                "account_id": "user",
                "tick_lower": 14000,
                "tick_upper": 16000,
                "base": 100,
                "accumulated": [0, 0],
                "updated_growths": [0, 0],
            },
        )

    def test_execute_limit_order_existent(self):
        self.pool.growth_between_ticks = mock.Mock(side_effect=[[6, 6], [4, 3]])

        self.pool.tracked_values_between_ticks = mock.Mock(
            side_effect=[([10, -1], [-5, 1]), ([30, -1], [-10, 1])]
        )

        self.pool.vamm_mint = mock.Mock()

        executed_base_amount = self.pool.execute_limit_order(
            maturity=self.maturity,
            account_id="user",
            base=100,
            lower_price=12000,
            upper_price=16000,
        )

        self.assertAlmostEqual(executed_base_amount, 100)

        self.assertEqual(
            self.pool._positions["user-12000-16000"],
            {
                "account_id": "user",
                "tick_lower": 12000,
                "tick_upper": 16000,
                "base": 200,
                "accumulated": [10.05, -4.975],
                "updated_growths": [6, 6],
            },
        )

    def test_execute_limit_order_negative(self):
        self.pool.growth_between_ticks = mock.Mock(side_effect=[[6, 6], [4, 3]])

        self.pool.tracked_values_between_ticks = mock.Mock(
            side_effect=[([10, -1], [-5, 1]), ([30, -1], [-10, 1])]
        )

        self.pool.vamm_mint = mock.Mock()

        executed_base_amount = self.pool.execute_limit_order(
            maturity=self.maturity,
            account_id="user",
            base=-50,
            lower_price=12000,
            upper_price=16000,
        )

        self.assertAlmostEqual(executed_base_amount, -50)

        self.assertEqual(
            self.pool._positions["user-12000-16000"],
            {
                "account_id": "user",
                "tick_lower": 12000,
                "tick_upper": 16000,
                "base": 50,
                "accumulated": [10.05, -4.975],
                "updated_growths": [6, 6],
            },
        )

    def test_execute_limit_order_negative_too_much(self):
        self.pool.growth_between_ticks = mock.Mock(side_effect=[[6, 6], [4, 3]])

        self.pool.tracked_values_between_ticks = mock.Mock(
            side_effect=[([10, -1], [-5, 1]), ([30, -1], [-10, 1])]
        )

        self.pool.vamm_mint = mock.Mock()

        with self.assertRaisesRegex(Exception, "trying to burn more than available"):
            self.pool.execute_limit_order(
                maturity=self.maturity,
                account_id="user",
                base=-150,
                lower_price=12000,
                upper_price=16000,
            )

    def test_execute_market_order(self):

        self.pool.vamm_swap = mock.Mock(return_value=100)

        executed_base_amount = self.pool.execute_market_order(
            maturity=self.maturity, base=100, price_limit=20000
        )

        self.assertAlmostEqual(executed_base_amount, 100)

        self.pool.vamm_swap.assert_called_with(base=100, tick_limit=20000)

    def test_close_positions(self):
        self.pool.growth_between_ticks = mock.Mock(
            side_effect=[
                [6, 6],
                [4, 3],
            ]
        )

        base, quote = self.pool.close_positions(
            maturity=self.maturity, account_id="user"
        )

        self.assertAlmostEqual(base, 5.1)
        self.assertAlmostEqual(quote, -4.875)

        (
            base,
            quote,
            unfilled_base_long,
            unfilled_base_short,
        ) = self.pool.get_account_filled_and_unfilled_balances(
            maturity=self.maturity, account_id="user"
        )

        self.assertEqual(base, 0)
        self.assertEqual(quote, 0)
        self.assertEqual(unfilled_base_long, 0)
        self.assertEqual(unfilled_base_short, 0)

    def test_gwap(self):
        self.pool.gwap_tick = mock.Mock(return_value=15000)
        self.assertAlmostEqual(self.pool.gwap(maturity=self.maturity), 15000)


if __name__ == "__main__":
    unittest.main()
