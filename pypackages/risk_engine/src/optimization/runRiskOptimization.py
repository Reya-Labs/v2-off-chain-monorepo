import numpy as np
import pandas as pd
from risk_engine.tests.mocks.mockPosition import mock_position
from risk_engine.src.optimization.runParameterOptimization import run_param_optimization

# todo: turn these into an argument for generate pool function -> stateless
MARKET = "irs_usdc"
RUN_OPTUNA = True
RUN_SIMPLER_OPTIMISATION = True
positions = mock_position[MARKET]

def main(p_lm, gamma, lambda_taker, lambda_maker, spread, lookback):






if __name__ == "__main__":
    from argparse import ArgumentParser
    parser = ArgumentParser()

    if RUN_OPTUNA:
        run_param_optimization(parser=parser)
    else:
        run_with_a_single_set_of_params(parser=parser)