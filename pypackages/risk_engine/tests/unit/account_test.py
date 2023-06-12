import unittest
from unittest.mock import Mock

from pypackages.risk_engine.src.constants import MONTH_IN_SECONDS
from pypackages.risk_engine.src.core.account import Account
from pypackages.risk_engine.src.evm.block import Block
from pypackages.risk_engine.tests.mocks.mockMarket import MockMarket
from pypackages.risk_engine.tests.mocks.mockMarketManager import MockMarketManager


class TestAccount(unittest.TestCase):
    def setUp(self):
        self.block = Block(relative_block_position=0)
        self.maturity = self.block.timestamp + MONTH_IN_SECONDS

        self.market_manager = MockMarketManager()

        self.market_irs = MockMarket(market_id="market_irs")
        self.market_dated_futures = MockMarket(market_id="market_dated_futures")

        self.account = Account(account_id="user", base_token="USDC")
        self.account.set_market_manager(market_manager=self.market_manager)

    def test_mark_market_non_existent(self):
        self.account.mark_market(market_id="market", maturity=self.maturity)

        self.assertAlmostEqual(
            self.account._active_markets, [("market", self.maturity)]
        )

    def test_mark_market_existent(self):
        self.account.mark_market(market_id="market", maturity=self.maturity)

        self.assertAlmostEqual(
            self.account._active_markets, [("market", self.maturity)]
        )

    def test_get_account_unrealized_pnl(self):
        # Mock active markets in account
        self.account._active_markets = [
            ("market_irs", self.maturity),
            ("market_dated_futures", self.maturity),
        ]

        # Mock markets
        self.market_irs.mock_get_unrealized_pnl_in_quote(return_value=100)
        self.market_dated_futures.mock_get_unrealized_pnl_in_quote(return_value=-20)

        # Mock market manager
        self.market_manager.get_market_by_id = Mock(
            side_effect=[self.market_irs, self.market_dated_futures]
        )

        # Trigger call
        account_unrealized_pnl = self.account.get_account_unrealized_pnl()

        # Check result
        self.assertAlmostEqual(account_unrealized_pnl, 80)

        # Check the market calls
        self.market_irs.get_unrealized_pnl_in_quote.assert_called_with(
            maturity=self.maturity, account_id="user"
        )

        self.market_dated_futures.get_unrealized_pnl_in_quote.assert_called_with(
            maturity=self.maturity, account_id="user"
        )

    def test_get_annualized_filled_and_unfilled_orders(self):
        # Mock active markets in account
        self.account._active_markets = [
            ("market_irs", self.maturity),
            ("market_dated_futures", self.maturity),
        ]

        # Mock markets
        self.market_irs.mock_get_annualized_filled_and_unfilled_bases(
            return_value=(1500, 3000, -1500)
        )

        self.market_dated_futures.mock_get_annualized_filled_and_unfilled_bases(
            return_value=(4000, -3000, 2000)
        )

        # Mock market manager
        self.market_manager.get_market_by_id = Mock(
            side_effect=[self.market_irs, self.market_dated_futures]
        )

        # Trigger call
        annualized_filled_and_unfilled_orders = (
            self.account.get_annualized_filled_and_unfilled_orders()
        )

        # Check result
        self.assertEqual(
            annualized_filled_and_unfilled_orders[0],
            {
                "market_id": "market_irs",
                "maturity": self.maturity,
                "filled": 1500,
                "unfilled_long": 3000,
                "unfilled_short": -1500,
            },
        )

        self.assertEqual(
            annualized_filled_and_unfilled_orders[1],
            {
                "market_id": "market_dated_futures",
                "maturity": self.maturity,
                "filled": 4000,
                "unfilled_long": -3000,
                "unfilled_short": 2000,
            },
        )

        # Check the market calls
        self.market_irs.get_annualized_filled_and_unfilled_bases.assert_called_with(
            maturity=self.maturity, account_id="user"
        )

        self.market_dated_futures.get_annualized_filled_and_unfilled_bases.assert_called_with(
            maturity=self.maturity, account_id="user"
        )

    def test_close_all_account_filled_and_unfilled_orders(self):
        # Mock active markets in account
        self.account._active_markets = [
            ("market_irs", self.maturity),
            ("market_dated_futures", self.maturity),
        ]

        # Mock market manager
        self.market_manager.get_market_by_id = Mock(
            side_effect=[self.market_irs, self.market_dated_futures]
        )

        # Trigger calls
        self.account.close_all_account_filled_and_unfilled_orders()

        # Check market calls
        self.market_irs.close_account.assert_called_with(
            maturity=self.maturity, account_id="user"
        )

        self.market_dated_futures.close_account.assert_called_with(
            maturity=self.maturity, account_id="user"
        )


if __name__ == "__main__":
    unittest.main()
