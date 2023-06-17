import unittest
from risk_engine.src.optimization.runParameterOptimization import run_parameter_optimization
from risk_engine.src.constants import MARKET_NAME, COLLATERAL_TOKEN_NAME, LIQUIDATOR_REWARD, MOCK_SIMULATION_SET
from types import SimpleNamespace

ORACLE_DATA_DIR = '../../mocks/data'

class RunParameterOptimizationTest(unittest.TestCase):

    def setUp(self):

        pass

    def test_run_parameter_optimization(self):

        parameters_dict: dict = {
            "n_trials": 2,
            "lambda_taker": 0.00,
            "lambda_maker": 0.00,
            "spread": 0.01,
            "oracle_data_dir": ORACLE_DATA_DIR,
            "market_name": MARKET_NAME,
            "collateral_token_name": COLLATERAL_TOKEN_NAME,
            "liquidator_reward": LIQUIDATOR_REWARD,
            "simulation_set": MOCK_SIMULATION_SET
        }

        parameters: SimpleNamespace = SimpleNamespace(**parameters_dict)

        run_parameter_optimization(parameters=parameters)







