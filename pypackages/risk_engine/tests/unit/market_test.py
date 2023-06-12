import unittest
from unittest import mock

from risk_engine.src.constants import MONTH_IN_SECONDS
from risk_engine.src.evm.block import Block
from risk_engine.src.instruments.dated_irs.baseMarket import BaseMarket
from risk_engine.tests.mocks.mockAccount import MockAccount
from risk_engine.tests.mocks.mockAccountManager import MockAccountManager
from risk_engine.tests.mocks.mockCollateralModule import MockCollateralModule
from risk_engine.tests.mocks.mockExchange import MockExchange
from risk_engine.tests.mocks.mockFeeManager import MockFeeManager
from risk_engine.tests.mocks.mockLiquidationModule import MockLiquidationModule
from risk_engine.tests.mocks.mockOracle import MockOracle


class MockMarket(BaseMarket):
    def __init__(self, block):
        super().__init__(
            block=block,
            market_id="market",
            base_token="ETH",
            quote_token="USDC",
        )

        self._annualize = mock.Mock()
        self.get_unrealized_pnl_in_quote = mock.Mock()

    def mock_annualize(self, return_value):
        self._annualize = mock.Mock(return_value=return_value)

    def mock_get_unrealized_pnl_in_quote(self, return_value):
        self.get_unrealized_pnl_in_quote = mock.Mock(return_value=return_value)


class TestIRSMarket(unittest.TestCase):
    def setUp(self):
        self.block = Block(relative_block_position=0)

        self.oracle = MockOracle()
        self.account_manager = MockAccountManager()
        self.fee_manager = MockFeeManager()

        self.user = MockAccount(account_id="user")
        self.account_manager.mock_get_account(return_value=self.user)

        self.collateral_module = MockCollateralModule()
        self.liquidation_module = MockLiquidationModule()

        self.market = MockMarket(block=self.block)

        self.market.set_collateral_module(collateral_module=self.collateral_module)
        self.market.set_liquidation_module(liquidation_module=self.liquidation_module)
        self.market.set_oracle(oracle=self.oracle)
        self.market.set_account_manager(account_manager=self.account_manager)
        self.market.set_fee_manager(fee_manager=self.fee_manager)

        self.maturity = self.block.timestamp + MONTH_IN_SECONDS

        self.pool_vamm = MockExchange(pool_id="USDC_VAMM")
        self.pool_clob = MockExchange(pool_id="USDC_CLOB")

        self.market.register_pool(pool=self.pool_vamm)
        self.market.register_pool(pool=self.pool_clob)

    def test_get_default_pool_id_when_initialized(self):
        self.market._default_pool_id = "USDC_VAMM"
        self.assertAlmostEqual(self.market.get_default_pool_id(), "USDC_VAMM")

    def test_get_default_pool_id_when_uninitialized(self):
        with self.assertRaisesRegex(
            Exception, "base market: default pool id has not been set"
        ):
            self.market.get_default_pool_id()

    def test_set_default_pool_id(self):
        self.market.set_default_pool_id(default_pool_id="USDC_CLOB")
        self.assertAlmostEqual(self.market._default_pool_id, "USDC_CLOB")

    def test_get_base_balance_per_maturity_when_maturity_non_existent(self):
        self.assertAlmostEqual(
            self.market.get_base_balance_per_maturity(
                maturity=self.maturity, account_id="user"
            ),
            0,
        )

    def test_get_base_balance_per_maturity_when_account_non_existent(self):
        self.market._base_balance_per_maturity.update({self.maturity: {"other": 10}})
        self.assertAlmostEqual(
            self.market.get_base_balance_per_maturity(
                maturity=self.maturity, account_id="user"
            ),
            0,
        )

    def test_get_base_balance_per_maturity_when_positive(self):
        self.market._base_balance_per_maturity.update({self.maturity: {"user": 10}})
        self.assertAlmostEqual(
            self.market.get_base_balance_per_maturity(
                maturity=self.maturity, account_id="user"
            ),
            10,
        )

    def test_get_quote_balance_per_maturity_when_maturity_non_existent(self):
        self.assertAlmostEqual(
            self.market.get_quote_balance_per_maturity(
                maturity=self.maturity, account_id="user"
            ),
            0,
        )

    def test_get_quote_balance_per_maturity_when_account_non_existent(self):
        self.market._quote_balance_per_maturity.update({self.maturity: {"other": 10}})
        self.assertAlmostEqual(
            self.market.get_quote_balance_per_maturity(
                maturity=self.maturity, account_id="user"
            ),
            0,
        )

    def test_get_quote_balance_per_maturity_when_positive(self):
        self.market._quote_balance_per_maturity.update({self.maturity: {"user": 10}})
        self.assertAlmostEqual(
            self.market.get_quote_balance_per_maturity(
                maturity=self.maturity, account_id="user"
            ),
            10,
        )

    def test_register_pool(self):
        with self.assertRaisesRegex(Exception, "Market: Pool already registered"):
            self.market.register_pool(pool=self.pool_vamm)

    def test_get_pool_by_id_when_existent(self):
        self.assertAlmostEqual(
            self.market.get_pool_by_id(pool_id="USDC_VAMM"), self.pool_vamm
        )

    def test_register_pool_when_non_existent(self):
        with self.assertRaisesRegex(Exception, "Market: Pool not registered"):
            self.market.get_pool_by_id(pool_id="ETH_RFQ")

    def test_process_limit_order_when_IM_satisfied(self):
        # Mock Fee Manager return values
        mock_fee_debits_and_credits = [
            {"account_id": "user", "fee_cashflow": -10},
            {
                "account_id": "protocol",
                "fee_cashflow": 10,
            },
        ]

        self.fee_manager.mock_get_atomic_fee_debits_and_credits(
            return_value=mock_fee_debits_and_credits
        )

        # Mock Pool return values
        mock_executed_base_amount = 900
        self.pool_vamm.mock_execute_limit_order(return_value=mock_executed_base_amount)

        # Mock Margin Engine return values
        self.liquidation_module.mock_is_im_satisfied(return_value=True)

        # Mock Market-specific return values
        self.market.mock_annualize(return_value=[675000])

        # Mock account
        self.user.mock_get_base_token(return_value="USDC")

        # Trigger the call
        (
            executed_base_amount,
            fee_debits_and_credits_in_fee_token,
        ) = self.market.process_limit_order(
            pool_id="USDC_VAMM",
            maturity=self.maturity,
            account_id="user",
            lower_price=0.03,
            upper_price=0.07,
            base=1000,
        )

        # Check the result
        self.assertAlmostEqual(executed_base_amount, mock_executed_base_amount)
        self.assertAlmostEqual(
            fee_debits_and_credits_in_fee_token, mock_fee_debits_and_credits
        )

        # Check if the pool functions have been called correctly
        self.pool_vamm.execute_limit_order.assert_called_with(
            maturity=self.maturity,
            account_id="user",
            base=1000,
            lower_price=0.03,
            upper_price=0.07,
        )

        # Check if the account manager functions have been called correctly
        self.account_manager.get_account(
            account_id="user"
        ).mark_market.assert_called_with(market_id="market", maturity=self.maturity)

        # Check if the fee manager functions have been called correctly
        self.fee_manager.get_atomic_fee_debits_and_credits.assert_called_with(
            market_id="market",
            annualized_notional=675000,
            account_id="user",
            is_taker=False,
        )

        # Check if the margin engine functions have been called correctly
        self.collateral_module.distribute_fees.assert_called_with(
            fee_debits_and_credits=mock_fee_debits_and_credits
        )

        self.liquidation_module.is_im_satisfied.assert_called_with(
            account_id="user",
            account_manager=self.account_manager,
            collateral_module=self.collateral_module,
        )

    def test_process_limit_order_when_IM_unsatisfied(self):
        # Mock Fee Manager return values
        self.fee_manager.mock_get_atomic_fee_debits_and_credits(return_value=[])

        # Mock Pool return values
        mock_executed_base_amount = 900
        self.pool_vamm.mock_execute_limit_order(return_value=mock_executed_base_amount)

        # Mock Margin Engine return values
        self.liquidation_module.mock_is_im_satisfied(return_value=False)

        # Mock Market-specific return values
        self.market.mock_annualize(return_value=[450])

        # Mock account
        self.user.mock_get_base_token(return_value="USDC")

        # Trigger the call and expect an exception
        with self.assertRaisesRegex(
            Exception, "Initial margin requirement of the account_id is not satisfied"
        ):
            self.market.process_limit_order(
                pool_id="USDC_VAMM",
                maturity=self.maturity,
                account_id="user",
                lower_price=0.03,
                upper_price=0.07,
                base=1000,
            )

    def test_process_market_order_when_IM_satisfied(self):
        # Mock Fee Manager return values
        mock_fee_debits_and_credits = [
            {"account_id": "user", "fee_cashflow": -10},
            {
                "account_id": "protocol",
                "fee_cashflow": 10,
            },
        ]

        self.fee_manager.mock_get_atomic_fee_debits_and_credits(
            return_value=mock_fee_debits_and_credits
        )

        # Mock Pool return values
        mock_executed_base_amount = 900
        mock_executed_quote_amount = -1100
        self.pool_vamm.mock_execute_market_order(
            return_value=(mock_executed_base_amount, mock_executed_quote_amount)
        )

        # Mock Margin Engine return values
        self.liquidation_module.mock_is_im_satisfied(return_value=True)

        # Mock Market-specific return values
        self.market.mock_annualize(return_value=[675000])

        # Mock account
        self.user.mock_get_base_token(return_value="USDC")

        # Trigger the call
        (
            executed_base_amount,
            executed_quote_amount,
            fee_debits_and_credits_in_fee_token,
        ) = self.market.process_market_order(
            pool_id="USDC_VAMM",
            maturity=self.maturity,
            account_id="user",
            base=1000,
        )

        # Check the result
        self.assertAlmostEqual(executed_base_amount, mock_executed_base_amount)
        self.assertAlmostEqual(executed_quote_amount, mock_executed_quote_amount)
        self.assertAlmostEqual(
            fee_debits_and_credits_in_fee_token, mock_fee_debits_and_credits
        )

        # Check the state change
        self.assertAlmostEqual(
            self.market._base_balance_per_maturity[self.maturity]["user"],
            mock_executed_base_amount,
        )

        self.assertAlmostEqual(
            self.market._quote_balance_per_maturity[self.maturity]["user"],
            mock_executed_quote_amount,
        )

        # Check if the pool functions have been called correctly
        self.pool_vamm.execute_market_order.assert_called_with(
            maturity=self.maturity,
            base=1000,
        )

        # Check if the account manager functions have been called correctly
        self.account_manager.get_account(
            account_id="user"
        ).mark_market.assert_called_with(market_id="market", maturity=self.maturity)

        # Check if the fee manager functions have been called correctly
        self.fee_manager.get_atomic_fee_debits_and_credits.assert_called_with(
            market_id="market",
            annualized_notional=675000,
            account_id="user",
            is_taker=True,
        )

        # Check if the margin engine functions have been called correctly
        self.collateral_module.distribute_fees.assert_called_with(
            fee_debits_and_credits=mock_fee_debits_and_credits
        )

        self.liquidation_module.is_im_satisfied.assert_called_with(
            account_id="user",
            account_manager=self.account_manager,
            collateral_module=self.collateral_module,
        )

    def test_process_market_order_when_IM_unsatisfied(self):
        # Mock Fee Manager return values
        mock_fee_debits_and_credits = []

        self.fee_manager.mock_get_atomic_fee_debits_and_credits(
            return_value=mock_fee_debits_and_credits
        )

        # Mock Pool return values
        mock_executed_base_amount = 900
        mock_executed_quote_amount = -1100
        self.pool_vamm.mock_execute_market_order(
            return_value=(mock_executed_base_amount, mock_executed_quote_amount)
        )

        # Mock Margin Engine return values
        self.liquidation_module.mock_is_im_satisfied(return_value=False)

        # Mock Market-specific return values
        self.market.mock_annualize(return_value=[450])

        # Mock account
        self.user.mock_get_base_token(return_value="USDC")

        with self.assertRaisesRegex(
            Exception, "Initial margin requirement of the account_id is not satisfied"
        ):
            self.market.process_market_order(
                pool_id="USDC_VAMM",
                maturity=self.maturity,
                account_id="user",
                base=1000,
            )

    def test_settlement_cashflow(self):
        self.oracle.mock_snapshot(return_value=1.05)

        settlement_cashflow = self.market.settlement_cashflow(
            maturity=self.maturity, base=1000, quote=-100
        )

        self.assertAlmostEqual(settlement_cashflow, 950)

        self.oracle.snapshot.assert_called_with(timestamp=self.maturity)

    def test_settle(self):
        # Mock pools
        self.pool_vamm.mock_close_positions(return_value=(100, -150))
        self.pool_vamm.mock_supported_maturities(return_value=[self.maturity])

        self.pool_clob.mock_close_positions(return_value=(-50, 60))
        self.pool_clob.mock_supported_maturities(return_value=[self.maturity])

        # Mock market balances
        self.market._base_balance_per_maturity.update({self.maturity: {"user": 30}})
        self.market._quote_balance_per_maturity.update({self.maturity: {"user": -20}})

        # Mock oracle
        self.oracle.mock_snapshot(return_value=1.05)

        # Trigger call
        self.market.settle(maturity=self.maturity, account_id="user")

        # Check state
        self.assertAlmostEqual(
            self.market._base_balance_per_maturity[self.maturity]["user"], 0
        )
        self.assertAlmostEqual(
            self.market._quote_balance_per_maturity[self.maturity]["user"], 0
        )

        # Check Margin Engine calls
        self.collateral_module.cashflow_propagation.assert_called_with(
            account_id="user", amount=-26
        )

    def test_get_account_filled_balances(self):
        self.pool_vamm.mock_get_account_filled_balances(return_value=(-500, 1000))
        self.pool_vamm.mock_supported_maturities(return_value=[self.maturity])

        self.pool_clob.mock_get_account_filled_balances(return_value=(750, -800))
        self.pool_clob.mock_supported_maturities(return_value=[self.maturity])

        self.market._base_balance_per_maturity.update({self.maturity: {"user": 30}})
        self.market._quote_balance_per_maturity.update({self.maturity: {"user": -20}})

        base, quote = self.market.get_account_filled_balances(
            maturity=self.maturity, account_id="user"
        )

        self.assertAlmostEqual(base, 280)
        self.assertAlmostEqual(quote, 180)

    def test_get_account_filled_and_unfilled_balances(self):
        self.pool_vamm.mock_get_account_filled_and_unfilled_balances(
            return_value=(-500, 1000, 400, -400)
        )
        self.pool_vamm.mock_supported_maturities(return_value=[self.maturity])

        self.pool_clob.mock_get_account_filled_and_unfilled_balances(
            return_value=(750, -800, 300, -200)
        )
        self.pool_clob.mock_supported_maturities(return_value=[self.maturity])

        self.market._base_balance_per_maturity.update({self.maturity: {"user": 30}})
        self.market._quote_balance_per_maturity.update({self.maturity: {"user": -20}})

        (
            base,
            quote,
            unfilled_base_long,
            unfilled_base_short,
        ) = self.market.get_account_filled_and_unfilled_balances(
            maturity=self.maturity, account_id="user"
        )

        self.assertAlmostEqual(base, 280)
        self.assertAlmostEqual(quote, 180)
        self.assertAlmostEqual(unfilled_base_long, 700)
        self.assertAlmostEqual(unfilled_base_short, -600)

    def test_get_annualized_filled_and_unfilled_bases(self):
        self.pool_vamm.mock_get_account_filled_and_unfilled_balances(
            return_value=(-500, 1000, 400, -400)
        )
        self.pool_vamm.mock_supported_maturities(return_value=[self.maturity])

        self.pool_clob.mock_get_account_filled_and_unfilled_balances(
            return_value=(750, -800, 300, -200)
        )
        self.pool_clob.mock_supported_maturities(return_value=[self.maturity])

        self.market._base_balance_per_maturity.update({self.maturity: {"user": 30}})
        self.market._quote_balance_per_maturity.update({self.maturity: {"user": -20}})

        self.market.mock_annualize(return_value=[100, 200, 300])

        (
            annualized_base,
            annualized_unfilled_base_long,
            annualized_unfilled_base_short,
        ) = self.market.get_annualized_filled_and_unfilled_bases(
            maturity=self.maturity, account_id="user"
        )

        self.assertAlmostEqual(annualized_base, 100)
        self.assertAlmostEqual(annualized_unfilled_base_long, 200)
        self.assertAlmostEqual(annualized_unfilled_base_short, 300)

        self.market._annualize.assert_called_with(
            bases=[280, 700, -600], maturity=self.maturity
        )

    def test_aggregate_gwap(self):
        self.pool_vamm.mock_gwap(return_value=0.05)
        self.pool_vamm.mock_supported_maturities(return_value=[self.maturity])

        self.pool_clob.mock_gwap(return_value=0.09)
        self.pool_clob.mock_supported_maturities(return_value=[self.maturity])

        self.market.set_slippage_phi(slippage_phi=0.01)
        self.market.set_slippage_beta(slippage_beta=0.25)

        self.assertAlmostEqual(
            self.market.aggregate_gwap(maturity=self.maturity, base=0), 0.07
        )

        self.assertAlmostEqual(
            self.market.aggregate_gwap(maturity=self.maturity, base=10000), 0.077
        )

        self.assertAlmostEqual(
            self.market.aggregate_gwap(maturity=self.maturity, base=-10000), 0.063
        )

    def test_route_market_order(self):
        self.market.set_default_pool_id(default_pool_id="USDC_VAMM")

        self.market.process_market_order = mock.Mock(return_value=(100, -100, 0))

        executed_base_amount, executed_quote_amount = self.market.route_market_order(
            maturity=self.maturity, account_id="user", base=100
        )

        self.assertAlmostEqual(executed_base_amount, 100)
        self.assertAlmostEqual(executed_quote_amount, -100)

        self.market.process_market_order.assert_called_with(
            pool_id="USDC_VAMM", maturity=self.maturity, account_id="user", base=100
        )

    def test_close_account(self):
        self.market.set_default_pool_id(default_pool_id="USDC_VAMM")

        # Mock pools
        self.pool_vamm.mock_close_positions(return_value=(100, -150))
        self.pool_vamm.mock_supported_maturities(return_value=[self.maturity])

        self.pool_clob.mock_close_positions(return_value=(-50, 60))
        self.pool_clob.mock_supported_maturities(return_value=[self.maturity])

        # Mock market balances
        self.market._base_balance_per_maturity.update({self.maturity: {"user": 30}})
        self.market._quote_balance_per_maturity.update({self.maturity: {"user": -20}})

        # Mock router market order
        self.market.route_market_order = mock.Mock()

        # Trigger call
        self.market.close_account(maturity=self.maturity, account_id="user")

        self.market.route_market_order.assert_called_with(
            maturity=self.maturity, account_id="user", base=-80
        )


if __name__ == "__main__":
    unittest.main()
