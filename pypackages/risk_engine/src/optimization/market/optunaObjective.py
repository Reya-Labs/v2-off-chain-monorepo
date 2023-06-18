import pandas as pd
from risk_engine.src.optimization.market.calculateObjective import calculate_objective
import numpy as np
from numpy import ndarray
from optuna import Trial
import optuna
from risk_engine.src.oracle_simulator.resampleLiquidityIndex import resample_liquidity_index
from risk_engine.src.oracle_simulator.dailyLiquidityIndexToApySeries import daily_liquidity_index_to_apy_series
from risk_engine.src.optimization.configurations import MarketParameterOptimizationConfiguration

def optuna_objective(market_parameter_optimization_config: MarketParameterOptimizationConfiguration, trial: Trial) -> ndarray:
    optuna.logging.set_verbosity(optuna.logging.DEBUG)
    p_lm_trial = trial.suggest_float("p_lm", 1.0, 5.0, log=True)
    gamma_trial = trial.suggest_float("gamma", 1.1, 5, log=True)
    lookback_trial = trial.suggest_int("lookback", 3, 15, log=True)

    # todo: dynamically produce simulations
    rate_oracle_dfs: list[pd.DataFrame] = [pd.read_csv(market_parameter_optimization_config.rate_oracle_data_dir + market_parameter_optimization_config.dated_irs_market_configuration.market_name + ".csv")]
    rate_oracle_dfs_resampled: list[pd.DataFrame] = [resample_liquidity_index(liquidity_index_df=df) for df in rate_oracle_dfs]
    apy_series_list: list[pd.Series] = [daily_liquidity_index_to_apy_series(liquidity_index_df=df, lookback_in_days=1) for df in rate_oracle_dfs_resampled]

    optimisations = [
        calculate_objective(
            apy=apy_series_list[i],
            timestamps=rate_oracle_dfs[i].loc[:, "timestamp"],
            liquidity_indicies=rate_oracle_dfs[i].loc[:, "liquidityIndex"],
            simulator_name='no_scaling',
            p_lm=p_lm_trial,
            gamma=gamma_trial,
            lambda_taker=market_parameter_optimization_config.market_fee_configuration.taker_fee_parameter,
            lambda_maker=market_parameter_optimization_config.market_fee_configuration.maker_fee_parameter,
            spread=market_parameter_optimization_config.vamm_configuration.lp_spread,
            lookback=lookback_trial,
            market_name=market_parameter_optimization_config.dated_irs_market_configuration.market_name,
            liquidator_reward=market_parameter_optimization_config.liquidation_configuration.liquidator_reward_parameter,
            acceptable_leverage_threshold=market_parameter_optimization_config.min_acceptable_leverage,
            collateral_token_name=market_parameter_optimization_config.dated_irs_market_configuration.quote_token,
            slippage_phi=market_parameter_optimization_config.vamm_configuration.slippage_model_parameters.slippage_phi,
            slippage_beta=market_parameter_optimization_config.vamm_configuration.slippage_model_parameters.slippage_beta
        )
        for i in range(len(rate_oracle_dfs))
    ]
    return np.mean(optimisations)
