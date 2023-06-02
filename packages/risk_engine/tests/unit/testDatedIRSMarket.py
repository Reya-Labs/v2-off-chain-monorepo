import unittest
from packages.risk_engine.tests.mocks.mockAccount import MockAccount
from packages.risk_engine.tests.mocks.mockAccountManager import MockAccountManager
from packages.risk_engine.tests.mocks.mockCollateralModule import MockCollateralModule
from packages.risk_engine.tests.mocks.mockFeeManager import MockFeeManager
from packages.risk_engine.tests.mocks.mo import MockOracle
from packages.risk_engine.tests.mocks.mockLiquidationModule import MockLiquidationModule
from packages.risk_engine.tests.mocks.mockExchange import MockExchange
from packages.risk_engine.src.evm.block import Block
from packages.risk_engine.src.constants import MONTH_IN_SECONDS
from packages.risk_engine.src.instruments.dated_irs.datedIRSMarket import DatedIRSMarket
from packages.risk_engine.src.oracles.rate.rateOracle import Observation


class TestIRSMarket(unittest.TestCase):
    def setUp(self):
        self.block = Block(relative_block_position=0)
        self.account_manager = MockAccountManager()
        self.fee_manager = MockFeeManager()
        # self.price_oracle = PriceOracle()
        self.collateral_module = MockCollateralModule()
        self.liquidation_module = MockLiquidationModule()

        self.user = MockAccount(account_id="user")
        self.account_manager.mock_get_account(return_value=self.user)

        self.market: DatedIRSMarket = DatedIRSMarket(block=self.block)

        self.market.set_collateral_module(collateral_module=self.collateral_module)
        self.market.set_liquidation_module(liquidation_module=self.liquidation_module)
        self.market.set_oracle(oracle=self.oracle)
        self.market.set_account_manager(account_manager=self.account_manager)
        self.market.set_fee_manager(fee_manager=self.fee_manager)
        # self.market.set_price_oracle(price_oracle=self.price_oracle)

        self.maturity = self.block.timestamp + MONTH_IN_SECONDS

        self.pool_vamm = MockExchange(pool_id="USDC_VAMM")
        self.pool_clob = MockExchange(pool_id="USDC_CLOB")

        self.market.register_pool(pool=self.pool_vamm)
        self.market.register_pool(pool=self.pool_clob)

    def test_annualize(self):
        self.oracle.mock_latest(1.05)

        annualized_bases = self.market._annualize(bases=[100, -50, 200], maturity=self.maturity)

        self.assertAlmostEqual(annualized_bases[0], 8.630136986301369)
        self.assertAlmostEqual(annualized_bases[1], -4.315068493150677)
        self.assertAlmostEqual(annualized_bases[2], 17.26027397260271)

        self.oracle.latest.assert_called()

    def test_get_unrealized_pnl_in_quote(self):
        # Mock account positions in pools and market
        self.pool_vamm.mock_get_account_filled_balances(return_value=(-500, 1000))
        self.pool_vamm.mock_supported_maturities(return_value=[self.maturity])
        self.pool_vamm.mock_gwap(return_value=0.05)

        self.pool_clob.mock_get_account_filled_balances(return_value=(750, -800))
        self.pool_clob.mock_supported_maturities(return_value=[self.maturity])
        self.pool_clob.mock_gwap(return_value=0.09)

        self.market._base_balance_per_maturity.update({self.maturity: {"user": 30}})
        self.market._quote_balance_per_maturity.update({self.maturity: {"user": -20}})

        # Mock oracle
        self.oracle.mock_latest(return_value=1.05)

        # Trigger call
        unrealized_pnl_in_quote = self.market.get_unrealized_pnl_in_quote(
            maturity=self.maturity, account_id="user"
        )

        # Check result
        self.assertAlmostEqual(unrealized_pnl_in_quote, 475.69150684931503)

        # Check oracle call
        self.oracle.latest.assert_called()


if __name__ == "__main__":
    unittest.main()