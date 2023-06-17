import pandas as pd
from risk_engine.src.constants import MOCK_SIMULATION_SET, DEFAULT_ACCEPTABLE_LEVERAGE_THRESHOLD
from risk_engine.src.optimization.calculateObjective import calculate_objective
import numpy as np
from numpy import ndarray
from optuna import Trial
import optuna


def optuna_objective(parameters, trial: Trial) -> ndarray:
    optuna.logging.set_verbosity(optuna.logging.DEBUG)
    p_lm_trial = trial.suggest_float("p_lm", 1.0, 5.0, log=True)
    gamma_trial = trial.suggest_float("gamma", 1.1, 5, log=True)
    lookback_trial = trial.suggest_int("lookback", 3, 15, log=True)

    rate_oracle_dfs: list[pd.DataFrame] = [pd.read_csv(parameters.oracle_data_dir + s + ".csv") for s in parameters.simulation_set]
    optimisations = [
        calculate_objective(
            rate_oracle_df=rate_oracle_dfs[i],
            simulator_name=parameters.simulation_set,
            p_lm=p_lm_trial,
            gamma=gamma_trial,
            lambda_taker=parameters.lambda_taker,
            lambda_maker=parameters.lambda_maker,
            spread=parameters.spread,
            lookback=lookback_trial,
            market_name=parameters.market_name,
            liquidator_reward=parameters.liquidator_reward,
            acceptable_leverage_threshold=DEFAULT_ACCEPTABLE_LEVERAGE_THRESHOLD,
            collateral_token_name=parameters.collateral_token_name,
            slippage_phi=parameters.slippage_phi,
            slippage_beta=parameters.slippage_beta
        )
        for i in range(len(rate_oracle_dfs))
    ]
    return np.mean(optimisations)
