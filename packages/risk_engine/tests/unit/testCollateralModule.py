import unittest
from packages.risk_engine.tests.mocks.mockAccount import MockAccount
from packages.risk_engine.tests.mocks.mockAccountManager import MockAccountManager
from packages.risk_engine.tests.mocks.mockLiquidationModule import MockLiquidationModule
from packages.risk_engine.src.evm.block import Block
from packages.risk_engine.src.constants import MONTH_IN_SECONDS
from packages.risk_engine.src.core.collateralModule import CollateralModule

class TestCollateralModule(unittest.TestCase):
    def setUp(self):
        self.block = Block(relative_block_position=0)
        self.account_manager = MockAccountManager()
        self.user: MockAccount = MockAccount(account_id="user")
        self.account_manager.mock_get_account(return_value=self.user)

        self.liquidation_module = MockLiquidationModule()

        self.collateral_module: CollateralModule = CollateralModule()

        self.maturity = self.block.timestamp + MONTH_IN_SECONDS

        self.setup_account()

    def setup_account(self):
        self.collateral_module._account_collateral_balance_mapping.update({"user": 200})

        self.user.mock_get_base_token(return_value="USDC")

        self.user.mock_get_account_unrealized_pnl(return_value=10)


    def test_get_account_collateral(self):
        self.assertAlmostEqual(self.collateral_module.get_account_collateral_balance(account_id="user"), 200)

    def test_distribute_fees(self):
        fee_debits_and_credits = [
            {
                "account_id": "user",
                "fee_cashflow": -10,
            },
            {
                "account_id": "receiver",
                "fee_cashflow": 10,
            },
        ]

        self.collateral_module.distribute_fees(fee_debits_and_credits=fee_debits_and_credits)

        # Check state change
        self.assertAlmostEqual(self.collateral_module._account_collateral_balance_mapping["user"], 190)

        self.assertAlmostEqual(self.collateral_module._account_collateral_balance_mapping["receiver"], 10)

    def test_positive_cashflow_propagation(self):
        self.collateral_module.cashflow_propagation(account_id="user", amount=100)

        self.assertAlmostEqual(self.collateral_module._account_collateral_balance_mapping["user"], 300)

    def test_negative_cashflow_propagation(self):
        self.collateral_module.cashflow_propagation(account_id="user", amount=-50)

        self.assertAlmostEqual(self.collateral_module._account_collateral_balance_mapping["user"], 150)

    def test_deposit_collateral(self):

        self.collateral_module.deposit_collateral(account_id="user", amount=50)

        self.assertAlmostEqual(self.collateral_module._account_collateral_balance_mapping["user"], 250)

    def test_withdraw_collateral_when_possible(self):
        self.liquidation_module.mock_is_im_satisfied(return_value=True)
        self.collateral_module.withdraw_collateral(account_id="user", amount=50, liquidation_module=self.liquidation_module)
        self.assertAlmostEqual(self.collateral_module._account_collateral_balance_mapping["user"], 150)

    def test_withdraw_collateral_when_impossible(self):
        self.liquidation_module.mock_is_im_satisfied(return_value=False)

        with self.assertRaisesRegex(Exception, "Withdrawal is not possible due to IM not satisfied"):
            self.collateral_module.withdraw_collateral(account_id="user", amount=160, liquidation_module=self.liquidation_module)

    def test_get_account_collateral_value(self):
        self.collateral_module._account_collateral_balance_mapping.update({"user": 100})

        self.assertAlmostEqual(self.collateral_module.get_account_collateral_balance(account_id="user"), 100)

    def test_get_account_total_value(self):
        self.assertAlmostEqual(self.collateral_module.get_account_total_value(account_id="user", account_manager=self.account_manager), 210)


if __name__ == "__main__":
    unittest.main()