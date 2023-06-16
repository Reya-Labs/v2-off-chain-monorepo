from risk_engine.src.constants import STANDARDIZED_TAKER_NOTIONAL, STANDARDIZED_MAKER_NOTIONAL
from risk_engine.src.calculators.riskMetrics import generate_replicates, generate_insolvencies_series, generate_liquidations_series, calculate_lvar_and_ivar
from pandas import Series

MAX_OBJECTIVE_PENALTY = 10
ACCEPTABLE_IVAR_THRESHOLD = 0.95
LEVERAGE_OBJECTIVE_WEIGHT = 0.5

def objective_function(lp_liquidation_threshold: Series, trader_liquidation_threshold: Series,
                       lp_unrealized_pnl: Series, trader_unrealized_pnl: Series,
                       lp_margin: Series, trader_margin: Series,
                       acceptable_leverage_threshold: float) -> float:

    average_leverage = LEVERAGE_OBJECTIVE_WEIGHT * (
            STANDARDIZED_MAKER_NOTIONAL / lp_liquidation_threshold.iloc[0]
            + STANDARDIZED_TAKER_NOTIONAL / trader_liquidation_threshold.iloc[0]
    )
    average_risk = (1 - LEVERAGE_OBJECTIVE_WEIGHT) * (
            lp_unrealized_pnl.std() + trader_unrealized_pnl.std()
    )
    regularisation = (
        MAX_OBJECTIVE_PENALTY if average_leverage < acceptable_leverage_threshold else 0
    )

    insolvencies_trader: Series = generate_insolvencies_series(actor_unrealized_pnl=trader_unrealized_pnl, actor_margin=trader_margin)
    liquidations_traders: Series = generate_liquidations_series(actor_margin=trader_margin, actor_liquidation_margin=trader_liquidation_threshold)
    insolvencies_lp: Series = generate_insolvencies_series(actor_unrealized_pnl=lp_unrealized_pnl, actor_margin=lp_margin)
    liquidations_lp: Series = generate_liquidations_series(actor_margin=lp_margin, actor_liquidation_margin=lp_liquidation_threshold)

    liquidations_replicates_trader, insolvencies_replicates_trader = generate_replicates(
        liquidations=liquidations_traders, insolvencies=insolvencies_trader
    )

    liquidations_replicates_lp, insolvencies_replicates_lp = generate_replicates(
        liquidations=liquidations_lp, insolvencies=insolvencies_lp
    )

    liquidations_var_trader, insolvencies_var_trader = calculate_lvar_and_ivar(
        liquidations_replicates=liquidations_replicates_trader,
        insolvencies_replicates=insolvencies_replicates_trader
    )

    liquidations_var_lp, insolvencies_var_lp = calculate_lvar_and_ivar(
        liquidations_replicates=liquidations_replicates_lp,
        insolvencies_replicates=insolvencies_replicates_lp
    )

    # todo: double check this averaging logic, check if we need to include the liquidations var in the objective
    average_liquidations_var = liquidations_var_trader * 0.5 + liquidations_var_lp * 0.5
    average_insolvencies_var = insolvencies_var_trader * 0.5 + insolvencies_var_lp * 0.5

    ivar_reg = MAX_OBJECTIVE_PENALTY if average_insolvencies_var < ACCEPTABLE_IVAR_THRESHOLD else 0

    objective = average_leverage - average_risk - regularisation - ivar_reg

    return objective