import os
import numpy as np
import pandas as pd
from risk_engine.src.calculators.RiskMetrics import RiskMetrics as rm
from risk_engine.tests.mocks.mockPosition import mock_position
from risk_engine.src.constants import YEAR_IN_SECONDS
from risk_engine.src.simulations.margin_requirements.MarginRequirements import MarginRequirements
from risk_engine.src.optimization.runParameterOptimization import run_param_optimization

# todo: turn these into an argument for generate pool function -> stateless
MARKET = "irs_usdc"
RUN_OPTUNA = True
RUN_SIMPLER_OPTIMISATION = True
positions = mock_position[MARKET]



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


if __name__ == "__main__":
    from argparse import ArgumentParser
    parser = ArgumentParser()

    if RUN_OPTUNA:
        run_param_optimization(parser=parser)
    else:
        run_with_a_single_set_of_params(parser=parser)