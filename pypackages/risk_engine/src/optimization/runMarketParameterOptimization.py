import optuna
from optuna import Study
import os
from optuna.trial import FrozenTrial
from risk_engine.src.optimization.optunaObjective import optuna_objective
import json

def add_parser_arguments(parser):
    parser.add_argument(
        "-n_trials", "--n_trials", type=float, help="Number of optimization trials", default=2
    )
    parser.add_argument("-slippage_beta", "--slippage_beta", type=float, help="Slippage Beta", default=0.01)
    parser.add_argument("-slippage_phi", "--slippage_phi", type=float, help="Slippage Phi", default=0.01)
    parser.add_argument("-acceptable_leverage_threshold", "--acceptable_leverage_threshold", type=float, help="Acceptable Leverage Threshold", default=20.0)
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

    # package parameters

    return parameters

def run_parameter_optimization(parameters):

    study: Study = optuna.create_study(
        direction="maximize",
        sampler=optuna.samplers.TPESampler(),
        pruner=optuna.pruners.SuccessiveHalvingPruner(),
    )

    objective = lambda trial: optuna_objective(trial=trial, parameters=parameters)

    study.optimize(objective, n_trials=parameters.n_trials)

    out_dir = f"./{parameters.market_name}/optuna_final/"
    if not os.path.exists(out_dir):
        os.makedirs(out_dir)

    optimal_trial: FrozenTrial = study.best_trial

    fig = optuna.visualization.plot_optimization_history(study)
    fig.write_image(out_dir + f"optuna_history_{parameters.market_name}.png")

    with open(out_dir + f"optimised_parameters_{parameters.market_name}.json", "w") as fp:
        json.dump(optimal_trial.params, fp, indent=4)


if __name__ == "__main__":
    from argparse import ArgumentParser
    parser = ArgumentParser()
    parameters = add_parser_arguments(parser)
    run_parameter_optimization(parameters=parameters)