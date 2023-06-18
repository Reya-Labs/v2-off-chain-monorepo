import optuna
from optuna import Study
import os
from optuna.trial import FrozenTrial
from risk_engine.src.optimization.im.optunaObjectiveIM import optuna_objective_im
from risk_engine.src.optimization.configurations import IMOptimizationConfiguration, LiquidationConfiguration, MarketRiskConfiguration, MarketFeeConfiguration, DatedIRSMarketConfiguration, VAMMConfiguration
from risk_engine.src.slippage.slippageModelParameters import SlippageModelParameters
import json

def add_parser_arguments(parser) -> IMOptimizationConfiguration:

    # rate oracle data directory
    parser.add_argument("-rate_oracle_data_dir", "--rate_oracle_data_dir", type=str, help="Rate Oracle CSV Data Directory")

    # risk parameters
    parser.add_argument("-liquidator_reward", "--liquidator_reward", type=float, help="Liquidator Reward Parameter",
                        default=0.03)
    parser.add_argument("-risk_parameter", "--risk_parameter", type=float, help="Risk Parameter")
    parser.add_argument("-twap_lookback_in_days", "--twap_lookback_in_days", type=int, help="Twap Lookback Window In Seconds")


    # market fee configuration
    parser.add_argument("-lambda_taker", "--lambda_taker", type=float, help="Taker fee", default=0.01)
    parser.add_argument("-lambda_maker", "--lambda_maker", type=float, help="Maker fee", default=0.005)

    # dated irs market configuration
    parser.add_argument(
        "-market_name", "--market_name", type=str, help="Name of market", default="dated_irs_ausdc_borrow"
    )
    parser.add_argument(
        "-collateral_token_name", "--collateral_token_name", type=str, help="Collateral Token Nam", default="USDC"
    )

    # vamm configuration
    parser.add_argument("-slippage_beta", "--slippage_beta", type=float, help="Slippage Beta", default=0.01)
    parser.add_argument("-slippage_phi", "--slippage_phi", type=float, help="Slippage Phi", default=0.01)
    parser.add_argument("-spread", "--spread", type=float, help="LP spread", default=0.01)

    # market parameter optimization configuration
    parser.add_argument(
        "-n_trials", "--n_trials", type=float, help="Number of optimization trials", default=2
    )
    parser.add_argument("-min_acceptable_leverage", "--min_acceptable_leverage", type=float,
                        help="Minimum Acceptable Leverage Threshold", default=20.0)


    parameters = parser.parse_args()

    liquidation_configuration = LiquidationConfiguration(liquidator_reward_parameter=parameters.liquidatorReward)
    market_risk_configuration = MarketRiskConfiguration(
        risk_parameter=parameters.risk_parameter,
        twap_lookback_in_days=parameters.twap_lookback_in_days
    )
    market_fee_configuration = MarketFeeConfiguration(maker_fee_parameter=parameters.lambda_maker, taker_fee_parameter=parameters.lambda_taker)
    dated_irs_market_configuration = DatedIRSMarketConfiguration(market_name=parameters.market_name, quote_token=parameters.collateral_token_name)
    vamm_configuration = VAMMConfiguration(
        lp_spread=parameters.spread,
        slippage_model_parameters=SlippageModelParameters(
            slippage_phi=parameters.slippage_phi,
            slippage_beta=parameters.slippage_beta
        )
    )

    market_parameter_optimization_config: IMOptimizationConfiguration = IMOptimizationConfiguration(
        rate_oracle_data_dir=parameters.rate_oracle_data_dir,
        number_of_optuna_trials=parameters.n_trials,
        min_acceptable_leverage=parameters.min_acceptable_leverage,
        liquidation_configuration=liquidation_configuration,
        market_risk_configuration=market_risk_configuration,
        market_fee_configuration=market_fee_configuration,
        dated_irs_market_configuration=dated_irs_market_configuration,
        vamm_configuration=vamm_configuration
    )

    return market_parameter_optimization_config

def run_parameter_optimization(im_parameter_optimization_config: IMOptimizationConfiguration):

    study: Study = optuna.create_study(
        direction="maximize",
        sampler=optuna.samplers.TPESampler(),
        pruner=optuna.pruners.SuccessiveHalvingPruner(),
    )

    objective = lambda trial: optuna_objective_im(trial=trial, im_parameter_optimization_config=im_parameter_optimization_config)

    study.optimize(objective, n_trials=im_parameter_optimization_config.number_of_optuna_trials)

    out_dir = f"./{im_parameter_optimization_config.dated_irs_market_configuration.market_name}/optuna_final/"
    if not os.path.exists(out_dir):
        os.makedirs(out_dir)

    optimal_trial: FrozenTrial = study.best_trial

    fig = optuna.visualization.plot_optimization_history(study)
    fig.write_image(out_dir + f"optuna_history_{im_parameter_optimization_config.dated_irs_market_configuration.market_name}.png")

    with open(out_dir + f"optimised_parameters_{im_parameter_optimization_config.dated_irs_market_configuration.market_name}.json", "w") as fp:
        json.dump(optimal_trial.params, fp, indent=4)


if __name__ == "__main__":
    from argparse import ArgumentParser
    parser = ArgumentParser()
    im_parameter_optimization_config: IMOptimizationConfiguration = add_parser_arguments(parser)
    run_parameter_optimization(im_parameter_optimization_config=im_parameter_optimization_config)