import datetime
import os

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

from risk_engine.src.constants import DAY_IN_SECONDS, YEAR_IN_SECONDS
from risk_engine.src.simulations.margin_requirements.marginRequirements import MarginRequirements


def run():
    datasets = {}
    with os.scandir("data/") as entries:
        for entry in entries:
            if entry.name.endswith(".csv"):
                df = pd.read_csv(entry.path)
                if (
                    "timestamp" not in df.columns
                    or "liquidity_index" not in df.columns
                    or "apy" not in df.columns
                ):
                    raise Exception(
                        "The dataset {0} does not have timestamp, liquidity_index and apy columns".format(
                            entry.name
                        )
                    )

                datasets.update({entry.name.removesuffix(".csv"): df})

    # todo: consider making this an input
    output_folder = "simulations/margin_requirements/outputs"

    # Create a directory to output all information about the simulations
    if not os.path.exists(output_folder):
        os.mkdir(output_folder)

        # Add git ignore to output directory
        git_ignore = open("{0}/.gitignore".format(output_folder), "w")
        git_ignore.write("*")
        git_ignore.close()

    for name, df in datasets.items():

        simulation_folder = "{0}/{1}".format(output_folder, name)

        # Create a directory to output all information about the simulation
        if not os.path.exists(simulation_folder):
            os.mkdir(simulation_folder)

        # Get information about dataset
        mean_apy = df["apy"].mean()
        std_dev = df["apy"].std()
        duration = df["timestamp"].values[-1] - df["timestamp"].values[0]

        # Build the input of the simulation
        risk_parameter = std_dev * np.sqrt(YEAR_IN_SECONDS / duration) * 2
        im_multiplier = 1.5

        slippage_phi = 2e-5
        slippage_beta = 1.02

        lp_spread = 0.01

        maker_fee = 0.0
        taker_fee = 0.0
        # todo: rename the variable to tell if in lookback is in seconds, days, etc?
        gwap_lookback = 3600

        # Write description of the scenario
        description_file = open("{0}/description.txt".format(simulation_folder), "w")
        description_file.write("This market is of duration {0} days.\n".format(duration / DAY_IN_SECONDS))
        description_file.write(
            "The initial fixed rate of the simulation is {:.2f}%.\n".format(mean_apy * 100)
        )
        description_file.write(
            "Maker: 10,000 notional between [{:.2f}%, {:.2f}%]\n".format(
                (mean_apy - lp_spread) * 100, (mean_apy + lp_spread) * 100
            )
        )
        description_file.write("Taker: 1,000 notional\n")
        description_file.close()

        # Plot the APYs
        df["date"] = [datetime.datetime.fromtimestamp(ts) for ts in df["timestamp"].values]
        df.plot(x="date", y=["apy"])
        plt.savefig("{0}/apy.png".format(simulation_folder))
        plt.clf()

        # Set up and run the simulation
        simulation = MarginRequirements()

        # todo: fill in the rest of the unfilled params
        simulation.setUp(
            collateral_token="ETH",
            initial_fixed_rate=mean_apy,
            risk_parameter=risk_parameter,
            im_multiplier=im_multiplier,
            slippage_phi=slippage_phi,
            slippage_beta=slippage_beta,
            lp_spread=lp_spread,
            is_trader_vt=True,
            timestamps=df["timestamp"].values,
            indices=df["liquidity_index"].values,
            maker_fee=maker_fee,
            taker_fee=taker_fee,
            gwap_lookback=gwap_lookback
        )

        simulation.run(output_folder=simulation_folder)
