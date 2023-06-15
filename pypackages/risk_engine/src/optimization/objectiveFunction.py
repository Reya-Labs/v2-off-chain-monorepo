import optuna
from optuna import Trial
import pandas as pd

def objective(trial: Trial, oracle_data_dir: str):

    # todo: consider turning the bounds for risk parameters into arguments for objective function

    optuna.logging.set_verbosity(optuna.logging.DEBUG)
    p_lm = trial.suggest_float("p_lm", 1.0, 5.0, log=True)
    gamma = trial.suggest_float("gamma", 1.1, 5, log=True)
    lookback = trial.suggest_int("lookback", 3, 15, log=True)

    oracles = [
        pd.read_csv(oracle_data_dir + s + ".csv") for s in positions["simulation_set"]
    ]

    # obj = main(p_lm=p_lm, gamma=gamma, lambda_taker=0.004, lambda_maker=0.002, spread=0.001, lookback=lookback)

    return obj