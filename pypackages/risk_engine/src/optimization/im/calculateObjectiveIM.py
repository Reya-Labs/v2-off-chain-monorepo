import pandas as pd
from risk_engine.src.simulations.margin_requirements.marginRequirements import MarginRequirements
import os
from pandas import Series
from risk_engine.src.optimization.im.objectiveFunctionIM import objective_function_im
from risk_engine.src.optimization.configurations import ProtocolRiskConfiguration, MarketRiskConfiguration, LiquidationConfiguration, MarketFeeConfiguration, DatedIRSMarketConfiguration, VAMMConfiguration


def calculate_objective(
        apy: Series,
        timestamps: Series,
        liquidity_indicies: Series,
        simulator_name: str,
        acceptable_leverage_threshold: float,
        protocol_risk_configuration: ProtocolRiskConfiguration,
        market_risk_configuration: MarketRiskConfiguration,
        liquidation_configuration: LiquidationConfiguration,
        market_fee_configuration: MarketFeeConfiguration,
        dated_irs_market_configuration: DatedIRSMarketConfiguration,
        vamm_configuration: VAMMConfiguration
) -> float:
    mean_apy_as_initial_fixed_rate_proxy = apy.mean()
    simulation = MarginRequirements()

    simulation.setUp(
        protocol_risk_configuration=protocol_risk_configuration,
        market_risk_configuration=market_risk_configuration,
        liquidation_configuration=liquidation_configuration,
        market_fee_configuration=market_fee_configuration,
        dated_irs_market_configuration=dated_irs_market_configuration,
        vamm_configuration=vamm_configuration,
        initial_fixed_rate=mean_apy_as_initial_fixed_rate_proxy,
        is_trader_vt=True,
        timestamps=timestamps.values,
        indices=liquidity_indicies.values,
    )

    simulation_folder = f"./{dated_irs_market_configuration.market_name}/{simulator_name}/optuna/"
    if not os.path.exists(simulation_folder):
        os.makedirs(simulation_folder)

    # todo: is there a way to define a pandas schema as a typing
    output: pd.DataFrame = simulation.run(output_folder=simulation_folder)

    objective = objective_function(
        lp_liquidation_threshold=output["lp_liquidation_threshold"],
        trader_liquidation_threshold=output["trader_liquidation_threshold"],
        lp_unrealized_pnl=output["lp_uPnL"],
        trader_unrealized_pnl=output["trader_uPnL"],
        trader_margin=output["trader_margin"],
        lp_margin=output["lp_margin"],
        acceptable_leverage_threshold=acceptable_leverage_threshold
    )

    return objective

