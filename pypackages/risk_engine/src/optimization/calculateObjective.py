import numpy as np
from risk_engine.src.simulations.margin_requirements.marginRequirements import MarginRequirements
from risk_engine.src.constants import YEAR_IN_SECONDS
import os
from pandas import DataFrame


# todo: add typings + consider introducing interfaces to better manage/pack the arguments
def calculate_objective(
        rate_oracle_df: DataFrame,
        simulator_name: str,
        p_lm: float,
        gamma: float,
        lambda_taker: float,
        lambda_maker: float,
        spread: float,
        lookback: float,
        liquidator_reward: float,
        market_name: str,
        min_leverage: float,
        collateral_token_name: str,
        slippage_phi: float,
        slippage_beta: float,
) -> float:
    mean_apy = rate_oracle_df["apy"].mean()
    if spread >= mean_apy:
        # todo: consider giving 0.001 more meaningful name and
        spread -= 0.001
    std_dev = rate_oracle_df["apy"].std()
    duration = rate_oracle_df["timestamp"].values[-1] - rate_oracle_df["timestamp"].values[0]
    # todo: pull this function into its own method to make conversio between risk param and p_lm more explicit or drop p_lm
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
        timestamps=rate_oracle_df["timestamp"].values,
        indices=rate_oracle_df["liquidity_index"].values,
        maker_fee=lambda_maker,
        taker_fee=lambda_taker,
        gwap_lookback=lookback,
        liquidator_reward=liquidator_reward
    )

    """
    1. Agent-based simulation of maker and taker positions in the
       IRS pool
    """
    simulation_folder = f"./{market_name}/{simulator_name}/optuna/"
    if not os.path.exists(simulation_folder):
        os.makedirs(simulation_folder)
    output = simulation.run(output_folder=simulation_folder)  # Add a return output to sim.run

    """
    2. Optimisation function implementation for Optuna
    """

    return objective

