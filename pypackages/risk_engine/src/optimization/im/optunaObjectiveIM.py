import pandas as pd
from risk_engine.src.optimization.market.calculateObjective import calculate_objective
import numpy as np
from numpy import ndarray
from optuna import Trial
import optuna
from risk_engine.src.oracle_simulator.resampleLiquidityIndex import resample_liquidity_index
from risk_engine.src.oracle_simulator.dailyLiquidityIndexToApySeries import daily_liquidity_index_to_apy_series
from risk_engine.src.optimization.configurations import IMOptimizationConfiguration, ProtocolRiskConfiguration

def optuna_objective_im(im_parameter_optimization_config: IMOptimizationConfiguration, trial: Trial) -> ndarray:
    optuna.logging.set_verbosity(optuna.logging.DEBUG)
    im_multiplier_trial = trial.suggest_float("risk_parameter", 1.1, 1.5, log=True)

    # todo: dynamically produce rescaled version of dataset
    rate_oracle_dfs: list[pd.DataFrame] = [pd.read_csv(im_parameter_optimization_config.rate_oracle_data_dir + im_parameter_optimization_config.dated_irs_market_configuration.market_name + ".csv")]
    rate_oracle_dfs_resampled: list[pd.DataFrame] = [resample_liquidity_index(liquidity_index_df=df) for df in rate_oracle_dfs]
    apy_series_list: list[pd.Series] = [daily_liquidity_index_to_apy_series(liquidity_index_df=df, lookback_in_days=1) for df in rate_oracle_dfs_resampled]

    protocol_risk_configuration: ProtocolRiskConfiguration = ProtocolRiskConfiguration(
        im_multiplier=im_multiplier_trial
    )

    optimisations = [
        calculate_objective(
            apy=apy_series_list[i],
            timestamps=rate_oracle_dfs[i].loc[:, "timestamp"],
            liquidity_indicies=rate_oracle_dfs[i].loc[:, "liquidityIndex"],
            simulator_name='no_scaling',
            acceptable_leverage_threshold=im_parameter_optimization_config.min_acceptable_leverage,
            protocol_risk_configuration=protocol_risk_configuration,
            market_risk_configuration=im_parameter_optimization_config.market_risk_configuration,
            liquidation_configuration=im_parameter_optimization_config.liquidation_configuration,
            market_fee_configuration=im_parameter_optimization_config.market_fee_configuration,
            dated_irs_market_configuration=im_parameter_optimization_config.dated_irs_market_configuration,
            vamm_configuration=im_parameter_optimization_config.vamm_configuration
        )
        for i in range(len(rate_oracle_dfs))
    ]
    return np.mean(optimisations)
