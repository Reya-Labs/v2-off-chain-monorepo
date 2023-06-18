import numpy as np
import pandas as pd

from risk_engine.src.simulations.margin_requirements.marginRequirements import MarginRequirements
from risk_engine.src.constants import YEAR_IN_SECONDS
import os
from pandas import Series
from risk_engine.src.optimization.objectiveFunction import objective_function


# todo: add typings + consider introducing interfaces to better manage/pack the arguments
def calculate_objective(
        apy: Series,
        timestamps: Series,
        liquidity_indicies: Series,
        simulator_name: str,
        p_lm: float,
        gamma: float,
        lambda_taker: float,
        lambda_maker: float,
        spread: float,
        lookback: float,
        liquidator_reward: float,
        market_name: str,
        acceptable_leverage_threshold: float,
        collateral_token_name: str,
        slippage_phi: float,
        slippage_beta: float,
) -> float:
    mean_apy = apy.mean()
    if spread >= mean_apy:
        spread -= 0.001
    std_dev = apy.std()
    duration = timestamps.values[-1] - timestamps.values[0]
    risk_parameter = std_dev * np.sqrt(YEAR_IN_SECONDS / duration) * p_lm
    simulation = MarginRequirements()

    # TODO: how can the fixed rate lookback window be added here i.e. where is the GWAP treated?
    simulation.setUp(
        collateral_token=collateral_token_name,
        initial_fixed_rate=mean_apy,
        risk_parameter=risk_parameter,
        im_multiplier=gamma,
        slippage_phi=slippage_phi,
        slippage_beta=slippage_beta,
        lp_spread=spread,
        is_trader_vt=True,
        timestamps=timestamps.values,
        indices=liquidity_indicies.values,
        maker_fee=lambda_maker,
        taker_fee=lambda_taker,
        gwap_lookback=lookback,
        liquidator_reward=liquidator_reward
    )

    simulation_folder = f"./{market_name}/{simulator_name}/optuna/"
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

