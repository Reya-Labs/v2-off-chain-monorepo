import json
import optuna


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
    from argparse import ArgumentParser
    parser = ArgumentParser()
    run_param_optimization(parser=parser)