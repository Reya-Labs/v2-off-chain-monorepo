import unittest
from unittest import mock
from packages.risk_engine.tests.mocks.mockAccount import MockAccount
from packages.risk_engine.tests.mocks.mockAccountManager import MockAccountManager
from packages.risk_engine.tests.mocks.mockCollateralModule import MockCollateralModule
from packages.risk_engine.src.evm.block import Block
from packages.risk_engine.src.constants import MONTH_IN_SECONDS
from packages.risk_engine.src.core.liquidationModule import LiquidationModule


class TestLiquidationModule(unittest.TestCase):
    def setUp(self):
        self.block = Block(relative_block_position=0)
        self.account_manager = MockAccountManager()

        self.user = MockAccount(account_id="user")
        self.account_manager.mock_get_account(return_value=self.user)

        self.liquidation_module = LiquidationModule(im_multiplier=1.5, liquidator_reward_proportion_of_im_delta=0.05)

        self.collateral_module = MockCollateralModule()

        self.maturity = self.block.timestamp + MONTH_IN_SECONDS

        self.liquidation_module._risk_mapping = {
            "DATED_FUTURE_ETH": {self.maturity: 0.8},
            "IRS_USDC": {self.maturity: -0.05},
        }

        self.collateral_module._collateral_factor_mapping = {
            "USDC": {
                "USDC": 1,
            }
        }

        self.setup_account()

    def setup_account(self):
        # Mock account
        self.user.mock_get_annualized_filled_and_unfilled_orders(
            return_value=[
                {
                    "market_id": "DATED_FUTURE_ETH",
                    "maturity": self.maturity,
                    "filled": 10,
                    "unfilled_long": 20,
                    "unfilled_short": -30,
                },
                {
                    "market_id": "IRS_USDC",
                    "maturity": self.maturity,
                    "filled": 40,
                    "unfilled_long": 500,
                    "unfilled_short": -300,
                },
            ]
        )

        self.user.mock_get_base_token(return_value="USDC")

    def test_is_im_satisfied_when_true(self):
        # Mock account balance with low collateral
        self.collateral_module.mock_get_account_net_worth(return_value=210)

        # Trigger call
        is_im_satisfied = self.liquidation_module.is_im_satisfied(account_id="user",
                                                                  account_manager=self.account_manager,
                                                                  collateral_module=self.collateral_module)

        # Check result
        self.assertAlmostEqual(is_im_satisfied, True)

    def test_is_im_satisfied_when_false(self):
        # Mock account balance with low collateral
        self.collateral_module.mock_get_account_net_worth(return_value=20)

        # Trigger call
        is_im_satisfied = self.liquidation_module.is_im_satisfied(account_id="user", account_manager=self.account_manager,
                                                                  collateral_module=self.collateral_module)

        # Check result
        self.assertAlmostEqual(is_im_satisfied, False)

    def test_is_account_liquidatable(self):
        pass

    def test_liquidate_account(self):
        self.user.get_annualized_filled_and_unfilled_orders = mock.Mock(
            side_effect=[self.user.get_annualized_filled_and_unfilled_orders.return_value, []]
        )

        # Mock account balance with low collateral
        self.collateral_module.mock_get_account_net_worth(return_value=20)
        self.collateral_module.mock_get_collateral_to_USD_exchange_rate(return_value=1)

        # Trigger call
        self.liquidation_module.liquidate_account(
            liquidated_account_id="user", liquidator_account_id="liquidator",
            account_manager=self.account_manager, collateral_module=self.collateral_module
        )

        # Check state change
        self.collateral_module._update_account_collateral.assert_any_call(
            account_id="user",
            amount=-3.225,
        )

        self.collateral_module._update_account_collateral.assert_any_call(
            account_id="liquidator",
            amount=3.225,
        )

    def test_get_account_margin_requirements(self):

        IMR, LMR = self.liquidation_module.get_account_margin_requirements(account_id="user", account_manager=self.account_manager)

        self.assertAlmostEqual(LMR, 43)
        self.assertAlmostEqual(IMR, 64.5)

    def test_get_worst_case_cashflows_post_up_and_down_shocks(self):
        annualized_worst_filled_up_and_down_notionals = [
            {
                "market_id": "DATED_FUTURE_ETH",
                "maturity": self.maturity,
                "worst_filled_up": 1000,
                "worst_filled_down": -500,
            },
            {
                "market_id": "IRS_USDC",
                "maturity": self.maturity,
                "worst_filled_up": -500,
                "worst_filled_down": 100,
            },
        ]

        (
            wc_cashflow_up_shock,
            wc_cashflow_down_shock,
        ) = self.liquidation_module.get_worst_case_cashflows_post_up_and_down_shocks(
            annualized_worst_filled_up_and_down_notionals=annualized_worst_filled_up_and_down_notionals
        )

        self.assertAlmostEqual(wc_cashflow_up_shock, 825)
        self.assertAlmostEqual(wc_cashflow_down_shock, 405)

    def test_get_risk_mapping(self):
        risk_mapping = self.liquidation_module.get_risk_mapping()

        self.assertAlmostEqual(
            risk_mapping, {"DATED_FUTURE_ETH": {self.maturity: 0.8}, "IRS_USDC": {self.maturity: -0.05}}
        )

    def test_set_risk_mapping(self):
        risk_mapping = {"IRS_USDC": {self.maturity: 0.7}, "IRS_DAI": {self.maturity: 0.9}}

        self.liquidation_module.set_risk_mapping(risk_mapping=risk_mapping)

        self.assertAlmostEqual(self.liquidation_module._risk_mapping, risk_mapping)

    def test_get_IM_multiplier(self):
        im_multiplier = self.liquidation_module.get_im_multiplier()

        self.assertAlmostEqual(im_multiplier, 1.5)

    def test_set_IM_multiplier(self):
        im_multiplier = 2

        self.liquidation_module.set_im_multiplier(im_multiplier=im_multiplier)

        self.assertAlmostEqual(self.liquidation_module._im_multiplier, im_multiplier)


if __name__ == "__main__":
    unittest.main()