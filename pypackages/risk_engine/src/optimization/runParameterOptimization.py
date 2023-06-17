import json
import optuna
import os
from runOptunaTrialParameters import calculate_objective_optuna_trial
from optuna import Study
from optuna.trial import FrozenTrial

def run_param_optimization(parser):

    parser.add_argument(
        "-n_trials", "--n_trials", type=float, help="Number of optimization trials", default=2
    )
    parser.add_argument(
        "-market_name", "--market_name", type=str, help="Name of market", default="irs_usdc"
    )
    parser.add_argument("-d", "--debug", action="store_true", help="Debug mode", default=False)
    n_trials = parser.parse_args().n_trials
    market_name = parser.parse_args().market_name

    study: Study = optuna.create_study(
        direction="maximize",
        sampler=optuna.samplers.TPESampler(),
        pruner=optuna.pruners.SuccessiveHalvingPruner(),
    )
    study.optimize(calculate_objective_optuna_trial, n_trials=n_trials)

    out_dir = f"./{market_name}/optuna_final/"
    if not os.path.exists(out_dir):
        os.makedirs(out_dir)

    trial: FrozenTrial = study.best_trial

    fig = optuna.visualization.plot_optimization_history(study)
    fig.write_image(out_dir + f"optuna_history_{market_name}.png")

    with open(out_dir + f"optimised_parameters_{market_name}.json", "w") as fp:
        json.dump(trial.params, fp, indent=4)

if __name__ == "__main__":
    from argparse import ArgumentParser
    parser = ArgumentParser()
    run_param_optimization(parser=parser)