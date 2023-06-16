from risk_engine.src.constants import STANDARDIZED_TAKER_NOTIONAL, STANDARDIZED_MAKER_NOTIONAL
from risk_engine.src.calculators.riskMetrics import
from pandas import Series

MAX_OBJECTIVE_PENALTY = 10
ACCEPTABLE_IVAR_THRESHOLD = 0.95
LEVERAGE_OBJECTIVE_WEIGHT = 0.5

def objective_function(lp_liquidation_threshold: Series, trader_liquidation_threshold: Series,
                       lp_unrealized_pnl: Series, trader_unrealized_pnl: Series,
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

    risk_metrics = RiskMetrics()
    lvar, ivar = risk_metrics.
    ivar_reg = MAX_OBJECTIVE_PENALTY if ivar < ACCEPTABLE_IVAR_THRESHOLD else 0

    objective = average_leverage - average_risk - regularisation - ivar_reg

    return objective