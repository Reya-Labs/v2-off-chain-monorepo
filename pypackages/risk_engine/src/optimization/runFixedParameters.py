import pandas as pd
from risk_engine.src.optimization.market.calculateObjective import calculate_objective
import numpy as np
from risk_engine.src.constants import SIMULATION_SET, DEFAULT_ACCEPTABLE_LEVERAGE_THRESHOLD

def run_with_a_single_set_of_params(parser):

    parser.add_argument("-p_lm", "--p_lm", type=float, help="p_lm risk matrix factor", default=2.0)
    parser.add_argument("-gamma", "--gamma", type=float, help="gamma factor for LP->IM conversion", default=1.5)
    parser.add_argument("-lambda_taker", "--lambda_taker", type=float, help="Taker fee", default=0.01)
    parser.add_argument("-lambda_maker", "--lambda_maker", type=float, help="Maker fee", default=0.005)
    parser.add_argument("-spread", "--spread", type=float, help="LP spread", default=0.01)
    parser.add_argument("-lookback", "--lookback", type=int, help="GWAP lookback window", default=2)
    parser.add_argument("-oracle_data_dir", "--oracle_data_dir", type=str, help="Rate Oracle CSV Data Directory")
    parser.add_argument(
        "-market_name", "--market_name", type=str, help="Name of market", default="irs_usdc"
    )
    parser.add_argument(
        "-collateral_token_name", "--collateral_token_name", type=str, help="Collateral Token Nam", default="USDC"
    )
    parser.add_argument("-liquidator_reward", "--liquidator_reward", type=float, help="Liquidator Reward Parameter", default=0.005)

    parameters = parser.parse_args()
    parameters_dict = dict((k, v) for k, v in vars(parameters).items() if v is not None)

    rate_oracle_dfs: list[pd.DataFrame] = [
        pd.read_csv(parameters_dict["oracle_data_dir"] + s + ".csv") for s in SIMULATION_SET
    ]
    optimisations = [
        calculate_objective(
            rate_oracle_df=rate_oracle_dfs[i],
            simulator_name=SIMULATION_SET[i],
            p_lm=parameters_dict['p_lm'],
            gamma=parameters_dict['gamma'],
            lambda_taker=parameters_dict['lambda_taker'],
            lambda_maker=parameters_dict['lambda_maker'],
            spread=parameters_dict['lambda_maker'],
            lookback=parameters_dict['lookback'],
            market_name=parameters_dict['market_name'],
            liquidator_reward=parameters_dict["liquidator_reward"],
            acceptable_leverage_threshold=DEFAULT_ACCEPTABLE_LEVERAGE_THRESHOLD,
            collateral_token_name=parameters_dict['collateral_token_name'],
            slippage_phi=parameters_dict['slippage_phi'],
            slippage_beta=parameters_dict['slippage_beta']
        )
        for i in range(len(rate_oracle_dfs))
    ]
    return np.mean(
        optimisations
    )


if __name__ == "__main__":
    from argparse import ArgumentParser
    parser = ArgumentParser()
    run_with_a_single_set_of_params(parser=parser)