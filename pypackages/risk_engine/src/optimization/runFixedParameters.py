import pandas as pd
from risk_engine.src.optimization.generatePool import generate_pool
import numpy as np
# temp
from risk_engine.tests.mocks.mockPositions import mock_positions


# todo: layer in typings (esp for positions)
def run_with_a_single_set_of_params(parser):

    # todo: consider representing positions via parser by linging them to json or smth

    # todo: add support for positions as argument
    parser.add_argument("-plm", "--p_lm", type=float, help="p_lm risk matrix factor", default=2.0)
    parser.add_argument("-gam", "--gamma", type=float, help="gamma factor for LP->IM conversion", default=1.5)
    parser.add_argument("-t", "--lambda_taker", type=float, help="Taker fee", default=0.01)
    parser.add_argument("-m", "--lambda_maker", type=float, help="Maker fee", default=0.005)
    parser.add_argument("-s", "--spread", type=float, help="LP spread", default=0.01)
    parser.add_argument("-l", "--lookback", type=int, help="GWAP lookback window", default=2)
    parser.add_argument("-oracle_data_dir", "--oracle_data_dir", type=str, help="Rate Oracle CSV Data Directory")
    parser.add_argument(
        "-market_name", "--market_name", type=str, help="Name of market", default="irs_usdc"
    )
    parser.add_argument("-liquidator_reward", "--liquidator_reward", type=float, help="Liquidator Reward Parameter", default=0.005)

    parameters = parser.parse_args()
    parameters_dict = dict((k, v) for k, v in vars(parameters).items() if v is not None)
    positions = mock_positions[parameters_dict['market_name']]

    # todo: simplify and expose in another function (duiplicate)
    oracles = [
        pd.read_csv(parameters_dict["oracle_data_dir"] + s + ".csv") for s in positions["simulation_set"]
    ]
    optimisations = [
        generate_pool(
            df=oracles[i],
            name=positions["simulation_set"][i],
            p_lm=parameters_dict['p_lm'],
            gamma=parameters_dict['gamma'],
            lambda_taker=parameters_dict['lambda_taker'],
            lambda_maker=parameters_dict['lambda_maker'],
            spread=parameters_dict['lambda_maker'],
            lookback=parameters_dict['lookback'],
            min_leverage=20,
            market_name=parameters_dict['market_name'],
            positions=positions,
            liquidator_reward=parameters_dict["liquidator_reward"]
        )
        for i in range(len(oracles))
    ]
    # todo: check in on this, do we want to return the average of optimizations
    return np.mean(
        optimisations
    )


if __name__ == "__main__":
    from argparse import ArgumentParser
    parser = ArgumentParser()
    run_with_a_single_set_of_params(parser=parser)