from packages.risk_engine.src.core.collateralModule import CollateralModule

class LiquidationModule:
    def __init__(self, im_multiplier: float, liquidator_reward_proportion_of_im_delta: float):

        self.account_manager = None
        self.collateral_module: CollateralModule = None

        self._risk_mapping = None
        self._im_multiplier: float = im_multiplier
        self.liquidator_reward_proportion_of_im_delta: float = liquidator_reward_proportion_of_im_delta

    def set_collateral_module(self, collateral_module):
        self.collateral_module = collateral_module

    def is_im_satisfied(self, account_id):
        account_net_worth = self.collateral_module.get_account_total_value(account_id=account_id)
        IMR, _ = self.get_account_margin_requirements(account_id=account_id)

        return account_net_worth >= IMR

    def is_account_liquidatable(self, account_id):
        account_value = self.collateral_module.get_account_total_value(account_id=account_id)
        IMR, LMR = self.get_account_margin_requirements(account_id=account_id)

        return account_value < LMR, IMR, LMR

    def liquidate_account(self, liquidated_account_id, liquidator_account_id):
        account = self.account_manager.get_account(account_id=liquidated_account_id)
        liquidator = self.account_manager.get_account(account_id=liquidator_account_id)

        liquidation_token_type = account.get_base_token()

        if not liquidator.get_base_token() == liquidation_token_type:
            raise Exception("liquidation engine: liquidator account is based on different token")

        is_account_liquidatable, im_pre_account_closing, _ = self.is_account_liquidatable(
            account_id=liquidated_account_id
        )
        if not is_account_liquidatable:
            raise Exception("liquidation engine: account is not liquidatable")

        account.close_all_account_filled_and_unfilled_orders()
        im_post_account_closing, _ = self.get_account_margin_requirements(account_id=liquidated_account_id)
        delta_im = im_pre_account_closing - im_post_account_closing

        if delta_im < 0:
            raise Exception("Account closing doesn't bring down account IM")

        # note: below logic only works for single token account types
        liquidator_reward_amount = delta_im * self.liquidator_reward_proportion_of_im_delta

        self.collateral_module.propagate_liquidator_reward(
            liquidated_account_id=liquidated_account_id,
            liquidator_account_id=liquidator_account_id,
            liquidator_reward_amount=liquidator_reward_amount
        )

    def get_account_margin_requirements(self, account_id):

        # retrieve the account object via the account_id
        account = self.account_manager.get_account(account_id=account_id)

        # can be a copy stored in memory
        annualized_filled_and_unfilled_orders = account.get_annualized_filled_and_unfilled_orders()

        worst_case_filled_orders = []

        for order in annualized_filled_and_unfilled_orders:
            risk_parameter = self.get_risk_parameter(market_id=order["market_id"], maturity=order["maturity"])

            max_long = order["filled"] + order["unfilled_long"]
            max_short = order["filled"] + order["unfilled_short"]

            worst_filled_up = max_long if risk_parameter > 0 else max_short
            worst_filled_down = max_short if risk_parameter > 0 else max_long

            worst_case_filled_orders.append(
                {
                    "market_id": order["market_id"],
                    "maturity": order["maturity"],
                    "worst_filled_up": worst_filled_up,
                    "worst_filled_down": worst_filled_down,
                }
            )

        (
            worst_case_cashflow_up_shock,
            worst_case_cashflow_down_shock,
        ) = self.get_worst_case_cashflows_post_up_and_down_shocks(
            annualized_worst_filled_up_and_down_notionals=worst_case_filled_orders
        )

        liquidation_margin_requirement = max(worst_case_cashflow_up_shock, worst_case_cashflow_down_shock)

        initial_margin_requirement = liquidation_margin_requirement * self._im_multiplier

        return initial_margin_requirement, liquidation_margin_requirement

    def get_worst_case_cashflows_post_up_and_down_shocks(self, annualized_worst_filled_up_and_down_notionals):
        worst_case_cashflow_up_shock = 0
        worst_case_cashflow_down_shock = 0
        for order in annualized_worst_filled_up_and_down_notionals:
            risk_parameter = self.get_risk_parameter(market_id=order["market_id"], maturity=order["maturity"])

            worst_case_cashflow_up_shock += order["worst_filled_up"] * risk_parameter
            worst_case_cashflow_down_shock += order["worst_filled_down"] * risk_parameter

        return abs(worst_case_cashflow_up_shock), abs(worst_case_cashflow_down_shock)

    def get_risk_parameter(self, market_id, maturity):
        if market_id not in self._risk_mapping:
            raise Exception("Risk parameter not found")

        if maturity not in self._risk_mapping[market_id]:
            raise Exception("Risk parameter not found")

        return self._risk_mapping[market_id][maturity]

    def get_risk_mapping(self):

        return self._risk_mapping.copy()

    def set_risk_mapping(self, risk_mapping):

        self._risk_mapping = risk_mapping.copy()

    def set_account_manager(self, account_manager):
        self.account_manager = account_manager

    def get_account_manager(self):
        if self.account_manager is None:
            raise Exception("collateral engine: account manager not set")

        return self.account_manager

    def set_IM_multiplier(self, im_multiplier):

        self._im_multiplier = im_multiplier

    def get_IM_multiplier(self):

        return self._im_multiplier