from risk_engine.src.constants import STANDARDIZED_TAKER_NOTIONAL, STANDARDIZED_MAKER_NOTIONAL
from risk_engine.src.calculators.riskMetrics import RiskMetrics
from pandas import Series


def objective_function(lp_liquidation_threshold: Series, trader_liquidation_threshold: Series,
                       lp_unrealized_pnl: Series, trader_unrealized_pnl: Series,
                       minimum_acceptable_leverage: float) -> float:

    average_leverage = 0.5 * (
            STANDARDIZED_MAKER_NOTIONAL / lp_liquidation_threshold.iloc[0]
            + STANDARDIZED_TAKER_NOTIONAL / trader_liquidation_threshold.iloc[0]
    )
    average_risk = 0.5 * (
            lp_unrealized_pnl.std() + trader_unrealized_pnl.std()
    )
    regularisation = (
        10 if average_leverage < minimum_acceptable_leverage else 0
    )

    risk_metrics = RiskMetrics(df=output)
    lvar, ivar = risk_metrics.lvar_and_ivar()
    ivar_reg = 10 if ivar < 0.95 else 0

    objective = average_leverage - average_risk - regularisation - ivar_reg

    return objective