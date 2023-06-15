import pandas as pd
from risk_engine.src.optimization.generatePool import generate_pool


def run_with_a_single_set_of_params(parser, positions):

    parser.add_argument("-plm", "--p_lm", type=float, help="p_lm risk matrix factor", default=2.0)
    parser.add_argument("-gam", "--gamma", type=float, help="gamma factor for LP->IM conversion", default=1.5)
    parser.add_argument("-t", "--lambda_taker", type=float, help="Taker fee", default=0.01)
    parser.add_argument("-m", "--lambda_maker", type=float, help="Maker fee", default=0.005)
    parser.add_argument("-s", "--spread", type=float, help="LP spread", default=0.01)
    parser.add_argument("-l", "--lookback", type=int, help="GWAP lookback window", default=2)

    tuneables = parser.parse_args()

    # Defining dictionary for the tuneable parameters
    tuneable_dict = dict((k, v) for k, v in vars(tuneables).items() if v is not None)
    print(tuneable_dict)

    # todo: simplify and expose in another function (duiplicate)
    sim_dir = "../MarketTradingSimulator/simulations/csv/"
    oracles = [
        pd.read_csv(sim_dir + s + ".csv") for s in positions["simulation_set"]
    ]  # Get the set of all simulations
    optimisations = [
        generate_pool(
            oracles[i],
            positions["simulation_set"][i],
            p_lm,
            gamma,
            lambda_taker,
            lambda_maker,
            spread,
            lookback,
            min_leverage=20,
        )
        for i in range(len(oracles))
    ]
    return np.mean(
        optimisations
    )  # We will optimise by averaging across all of the markets. TODO: confirm this is reasonabl