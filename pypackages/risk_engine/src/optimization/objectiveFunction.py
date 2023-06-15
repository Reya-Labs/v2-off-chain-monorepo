


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