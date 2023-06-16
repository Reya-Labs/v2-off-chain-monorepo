import unittest
from risk_engine.src.optimization.calculateObjective import generate_pool
import pandas as pd
from risk_engine.src.constants import DEFAULT_P_LM, DEFAULT_GAMMA, TAKER_FEE, MAKER_FEE, LP_SPREAD, DEFAULT_GWAP_LOOKBACK, LIQUIDATOR_REWARD, MARKET_NAME, COLLATERAL_TOKEN_NAME, DEFAULT_SLIPPAGE_PHI, DEFAULT_SLIPPAGE_BETA


MOCK_ORACLE_PATH = '../../mocks/data/mock_ausdc_borrow_rate.csv'

class GeneratePoolTest(unittest.TestCase):


    def test_generate_pool(self):

        rate_oracle_df = pd.read_csv(
            MOCK_ORACLE_PATH
        )

        # todo: revisit this
        simulator_name = "apy_OracleSimulator"





