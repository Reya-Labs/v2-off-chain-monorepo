import numpy as np
from risk_engine.src.simulations.margin_requirements.marginRequirements import MarginRequirements
from risk_engine.src.constants import YEAR_IN_SECONDS
from risk_engine.src.calculators.riskMetrics import RiskMetrics
import os

# todo: add typings
def generate_pool(
    df, name, p_lm, gamma, lambda_taker, lambda_maker, spread, lookback, positions, market_name: str, min_leverage=20
) -> float:
    mean_apy = df["apy"].mean()
    if spread >= mean_apy:
        # todo: consider giving 0.001 more meaningful name and
        spread -= 0.001
    std_dev = df["apy"].std()
    duration = df["timestamp"].values[-1] - df["timestamp"].values[0]
    # Build the input of the simulation
    risk_parameter = std_dev * np.sqrt(YEAR_IN_SECONDS / duration) * p_lm
    simulation = MarginRequirements()

    # TODO: how can the fixed rate lookback window be added here i.e. where is the GWAP treated?
    # I think this needs to be added to the IRS market object
    simulation.setUp(
        collateral_token=positions["base_token"],
        initial_fixed_rate=mean_apy,
        risk_parameter=risk_parameter,
        im_multiplier=gamma,
        slippage_phi=positions["phi"],
        slippage_beta=positions["beta"],
        lp_spread=spread,
        is_trader_vt=True,
        timestamps=df["timestamp"].values,
        indices=df["liquidity_index"].values,
        maker_fee=lambda_maker,
        taker_fee=lambda_taker,
        gwap_lookback=lookback,
    )

    """
    1. Agent-based simulation of maker and taker positions in the
       IRS pool
    """
    simulation_folder = f"./{market_name}/{name}/optuna/"
    if not os.path.exists(simulation_folder):
        os.makedirs(simulation_folder)
    output = simulation.run(output_folder=simulation_folder)  # Add a return output to sim.run

    """
    2. Optimisation function implementation for Optuna
    """
    # We need to evaluate the objective function here
    # We use the lists defined above here
    average_leverage = 0.5 * (
        positions["maker_amount"] / output.iloc[0]["lp_liquidation_threshold"]
        + positions["taker_amount"] / output.iloc[0]["trader_liquidation_threshold"]
    )
    average_risk = 0.5 * (
        output["lp_uPnL"].std() + output["trader_uPnL"].std()
    )  # Normalise risk to collateral supplied
    regularisation = (
        10 if average_leverage < min_leverage else 0
    )  # Add in a regularisation term to constrain the minimum leverage

    # Finally we need to compute an insolvency VaR, IVaR
    risk_metrics = RiskMetrics(df=output)
    lvar, ivar = risk_metrics.lvar_and_ivar()
    ivar_reg = 10 if ivar < 0.95 else 0

    objective = average_leverage - average_risk - regularisation - ivar_reg
    return objective  # Objective function

