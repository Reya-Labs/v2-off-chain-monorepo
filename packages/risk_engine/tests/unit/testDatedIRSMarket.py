import unittest
from packages.risk_engine.tests.mocks.mockAccount import MockAccount
from packages.risk_engine.tests.mocks.mockAccountManager import MockAccountManager
from packages.risk_engine.tests.mocks.mockCollateralModule import MockCollateralModule
from packages.risk_engine.tests.mocks.mockFeeManager import MockFeeManager
from packages.risk_engine.tests.mocks.mockLiquidationModule import MockLiquidationModule
from packages.risk_engine.tests.mocks.mockExchange import MockExchange
from packages.risk_engine.src.evm.block import Block
from packages.risk_engine.src.constants import MONTH_IN_SECONDS
from packages.risk_engine.src.instruments.dated_irs.datedIRSMarket import DatedIRSMarket


class TestIRSMarket(unittest.TestCase):
    def setUp(self):
        self.block: Block = Block(relative_block_position=0)
        self.account_manager: MockAccountManager = MockAccountManager()
        self.fee_manager: MockFeeManager = MockFeeManager()
        self.collateral_module = MockCollateralModule()
        self.liquidation_module = MockLiquidationModule()

        self.user = MockAccount(account_id="user")
        self.account_manager.mock_get_account(return_value=self.user)

        self.market = DatedIRSMarket(block=self.block)

        self.market.set_collateral_module(collateral_module=self.collateral_module)
        self.market.set_liquidation_module(liquidation_module=self.liquidation_module)
        self.market.set_account_manager(account_manager=self.account_manager)
        self.market.set_fee_manager(fee_manager=self.fee_manager)
        self.market.set_price_oracle(price_oracle=self.rate_oracle)

        self.maturity = self.block.timestamp + MONTH_IN_SECONDS

        self.pool_vamm = MockExchange(pool_id="rates_vamm")
        self.pool_clob = MockExchange(pool_id="rates_clob")

        self.market.register_pool(pool=self.pool_vamm)
        self.market.register_pool(pool=self.pool_clob)

    def test_annualize(self):
        annualized_bases = self.market._annualize(bases=[100, -50, 200], maturity=self.maturity)

        self.assertAlmostEqual(annualized_bases[0], 150000)
        self.assertAlmostEqual(annualized_bases[1], -75000)
        self.assertAlmostEqual(annualized_bases[2], 300000)

    def test_get_unrealized_pnl_in_quote(self):
        # Mock account positions in pools and market
        self.pool_vamm.mock_get_account_filled_balances(return_value=(-5, 7500))
        self.pool_vamm.mock_supported_maturities(return_value=[self.maturity])
        self.pool_vamm.mock_gwap(return_value=1500)

        self.pool_clob.mock_get_account_filled_balances(return_value=(2, -2800))
        self.pool_clob.mock_supported_maturities(return_value=[self.maturity])
        self.pool_clob.mock_gwap(return_value=1700)

        self.market._base_balance_per_maturity.update({self.maturity: {"user": 1}})
        self.market._quote_balance_per_maturity.update({self.maturity: {"user": -1450}})

        unrealized_pnl_in_quote = self.market.get_unrealized_pnl_in_quote(
            maturity=self.maturity, account_id="user"
        )

        self.assertAlmostEqual(unrealized_pnl_in_quote, 50)


if __name__ == "__main__":
    unittest.main()