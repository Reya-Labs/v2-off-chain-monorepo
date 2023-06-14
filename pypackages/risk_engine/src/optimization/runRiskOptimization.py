import json
import os
import numpy as np
import optuna
import pandas as pd
from risk_engine.src.calculators.RiskMetrics import RiskMetrics as rm
from risk_engine.tests.mocks.mockPosition import mock_position
from risk_engine.src.constants import YEAR_IN_SECONDS
from risk_engine.src.simulations.margin_requirements.MarginRequirements import MarginRequirements


# todo: turn these into an argument for generate pool function -> stateless
MARKET = "irs_usdc"
RUN_OPTUNA = True
RUN_SIMPLER_OPTIMISATION = True
positions = mock_position[MARKET]


def generate_pool(
    df, name, p_lm, gamma, lambda_taker, lambda_maker, spread, lookback, min_leverage=20
) -> float:  # Populate with risk parameters
    # df: need to pass the oracle to the end-to-end test in the correct way
    print(df)
    mean_apy = df["apy"].mean()
    if spread >= mean_apy:
        spread -= 0.001
    std_dev = df["apy"].std()
    duration = df["timestamp"].values[-1] - df["timestamp"].values[0]
    # Build the input of the simulation
    risk_parameter = std_dev * np.sqrt(YEAR_IN_SECONDS / duration) * p_lm

    # Instantiate the IRS pool and simulation
    simulation = MarginRequirements()

    print("TIMESTAMPS: ", df["timestamp"].values)
    print("INDEX: ", df["liquidity_index"].values)

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
    simulation_folder = f"./{MARKET}/{name}/optuna/"
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
    risk_metrics = rm.RiskMetrics(df=output)
    lvar, ivar = risk_metrics.lvar_and_ivar()
    ivar_reg = 10 if ivar < 0.95 else 0

    objective = average_leverage - average_risk - regularisation - ivar_reg
    return objective  # Objective function


def main(p_lm, gamma, lambda_taker, lambda_maker, spread, lookback):
    sim_dir = "../MarketTradingSimulator/simulations/csv/"
    oracles = [
        pd.read_csv(sim_dir + s + ".csv") for s in positions["simulation_set"]
    ]  # Get the set of all simulations
    optimisations = [
        generate_pool(
            oracles[i],
            positions["simulation_set"][i],
            p_lm,
            gamma,
            lambda_taker,
            lambda_maker,
            spread,
            lookback,
            min_leverage=20,
        )
        for i in range(len(oracles))
    ]
    return np.mean(
        optimisations
    )  # We will optimise by averaging across all of the markets. TODO: confirm this is reasonable


def run_with_a_single_set_of_params(parser):

    parser.add_argument("-plm", "--p_lm", type=float, help="p_lm risk matrix factor", default=2.0)
    parser.add_argument("-gam", "--gamma", type=float, help="gamma factor for LP->IM conversion", default=1.5)
    parser.add_argument("-t", "--lambda_taker", type=float, help="Taker fee", default=0.01)
    parser.add_argument("-m", "--lambda_maker", type=float, help="Maker fee", default=0.005)
    parser.add_argument("-s", "--spread", type=float, help="LP spread", default=0.01)
    parser.add_argument("-l", "--lookback", type=int, help="GWAP lookback window", default=2)

    tuneables = parser.parse_args()

    # Defining dictionary for the tuneable parameters
    tuneable_dict = dict((k, v) for k, v in vars(tuneables).items() if v is not None)
    print(tuneable_dict)
    main(**tuneable_dict)


def objective(trial):

    optuna.logging.set_verbosity(optuna.logging.DEBUG)
    # Risk parameters
    p_lm = trial.suggest_float("p_lm", 1.0, 5.0, log=True)
    gamma = trial.suggest_float("gamma", 1.1, 5, log=True)
    lookback = trial.suggest_int("lookback", 3, 15, log=True)
    if not RUN_SIMPLER_OPTIMISATION:
        lambda_taker = trial.suggest_float("lambda_taker", 0.001, 0.015, log=True)
        lambda_maker = trial.suggest_float("lambda_maker", 0.001, 0.015, log=True)
        spread = trial.suggest_float("spread", 0.001, 0.01, log=True)

    obj = (
        main(p_lm=p_lm, gamma=gamma, lambda_taker=0.004, lambda_maker=0.002, spread=0.001, lookback=lookback)
        if RUN_SIMPLER_OPTIMISATION
        else main(
            p_lm=p_lm,
            gamma=gamma,
            lambda_taker=lambda_taker,
            lambda_maker=lambda_maker,
            spread=spread,
            lookback=lookback,
        )
    )
    return obj


def run_param_optimization(parser):

    parser.add_argument(
        "-n_trials", "--n_trials", type=float, help="Number of optimization trials", default=2
    )
    parser.add_argument("-d", "--debug", action="store_true", help="Debug mode", default=False)
    n_trials = parser.parse_args().n_trials

    study = optuna.create_study(
        direction="maximize",
        sampler=optuna.samplers.TPESampler(),
        pruner=optuna.pruners.SuccessiveHalvingPruner(),
    )
    study.optimize(objective, n_trials=n_trials)

    # Relevant output plots
    out_dir = f"./{MARKET}/optuna_final/"
    if not os.path.exists(out_dir):
        os.makedirs(out_dir)

    # Output optimised results
    trial = study.best_trial
    print(f"Best optimised value: {trial.value}")

    print("Optimised parameters: ")
    for key, value in trial.params.items():
        print(f"{key}: {value}")

    fig = optuna.visualization.plot_optimization_history(study)
    fig.write_image(out_dir + f"optuna_history_{MARKET}.png")

    with open(out_dir + f"optimised_parameters_{MARKET}.json", "w") as fp:
        json.dump(trial.params, fp, indent=4)


if __name__ == "__main__":
    # Adding an argument parser
    from argparse import ArgumentParser

    parser = ArgumentParser()

    if RUN_OPTUNA:
        run_param_optimization(parser=parser)
    else:
        run_with_a_single_set_of_params(parser=parser)