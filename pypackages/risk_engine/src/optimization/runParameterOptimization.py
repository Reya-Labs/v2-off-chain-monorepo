import optuna
from optuna import Trial
import pandas as pd
from risk_engine.src.constants import SIMULATION_SET, DEFAULT_ACCEPTABLE_LEVERAGE_THRESHOLD
from risk_engine.src.optimization.calculateObjective import calculate_objective
import numpy as np
from numpy import ndarray

def calculate_objective_optuna_trial(parser, trial: Trial) -> ndarray:

    parser.add_argument("-lambda_taker", "--lambda_taker", type=float, help="Taker fee", default=0.01)
    parser.add_argument("-lambda_maker", "--lambda_maker", type=float, help="Maker fee", default=0.005)
    parser.add_argument("-spread", "--spread", type=float, help="LP spread", default=0.01)
    parser.add_argument("-oracle_data_dir", "--oracle_data_dir", type=str, help="Rate Oracle CSV Data Directory")
    parser.add_argument(
        "-market_name", "--market_name", type=str, help="Name of market", default="irs_usdc"
    )
    parser.add_argument(
        "-collateral_token_name", "--collateral_token_name", type=str, help="Collateral Token Nam", default="USDC"
    )
    parser.add_argument("-liquidator_reward", "--liquidator_reward", type=float, help="Liquidator Reward Parameter",
                        default=0.005)

    parameters = parser.parse_args()
    parameters_dict = dict((k, v) for k, v in vars(parameters).items() if v is not None)


    optuna.logging.set_verbosity(optuna.logging.DEBUG)
    p_lm_trial = trial.suggest_float("p_lm", 1.0, 5.0, log=True)
    gamma_trial = trial.suggest_float("gamma", 1.1, 5, log=True)
    lookback_trial = trial.suggest_int("lookback", 3, 15, log=True)

    rate_oracle_dfs: list[pd.DataFrame] = [
        pd.read_csv(parameters_dict["oracle_data_dir"] + s + ".csv") for s in SIMULATION_SET
    ]
    optimisations = [
        calculate_objective(
            rate_oracle_df=rate_oracle_dfs[i],
            simulator_name=SIMULATION_SET[i],
            p_lm=p_lm_trial,
            gamma=gamma_trial,
            lambda_taker=parameters_dict['lambda_taker'],
            lambda_maker=parameters_dict['lambda_maker'],
            spread=parameters_dict['lambda_maker'],
            lookback=lookback_trial,
            market_name=parameters_dict['market_name'],
            liquidator_reward=parameters_dict["liquidator_reward"],
            acceptable_leverage_threshold=DEFAULT_ACCEPTABLE_LEVERAGE_THRESHOLD,
            collateral_token_name=parameters_dict['collateral_token_name'],
            slippage_phi=parameters_dict['slippage_phi'],
            slippage_beta=parameters_dict['slippage_beta']
        )
        for i in range(len(rate_oracle_dfs))
    ]
    return np.mean(optimisations)


#
# import json
# import optuna
# import os
# from runOptunaTrialParameters import calculate_objective_optuna_trial
# from optuna import Study
# from optuna.trial import FrozenTrial
#
# # todo: pass the parser to param optimization
# def run_param_optimization(parser):
#
#     parser.add_argument(
#         "-n_trials", "--n_trials", type=float, help="Number of optimization trials", default=2
#     )
#     parser.add_argument(
#         "-market_name", "--market_name", type=str, help="Name of market", default="irs_usdc"
#     )
#     parser.add_argument("-d", "--debug", action="store_true", help="Debug mode", default=False)
#     n_trials = parser.parse_args().n_trials
#     market_name = parser.parse_args().market_name
#
#     study: Study = optuna.create_study(
#         direction="maximize",
#         sampler=optuna.samplers.TPESampler(),
#         pruner=optuna.pruners.SuccessiveHalvingPruner(),
#     )
#     study.optimize(calculate_objective_optuna_trial, n_trials=n_trials)
#
#     out_dir = f"./{market_name}/optuna_final/"
#     if not os.path.exists(out_dir):
#         os.makedirs(out_dir)
#
#     trial: FrozenTrial = study.best_trial
#
#     fig = optuna.visualization.plot_optimization_history(study)
#     fig.write_image(out_dir + f"optuna_history_{market_name}.png")
#
#     with open(out_dir + f"optimised_parameters_{market_name}.json", "w") as fp:
#         json.dump(trial.params, fp, indent=4)
#
# if __name__ == "__main__":
#     from argparse import ArgumentParser
#     parser = ArgumentParser()
#     run_param_optimization(parser=parser)