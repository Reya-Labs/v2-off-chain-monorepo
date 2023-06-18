import unittest
import pandas as pd

MOCK_ORACLE_PATH = '../../mocks/data/mock_ausdc_borrow_rate.csv'

class GeneratePoolTest(unittest.TestCase):


    def test_generate_pool(self):

        rate_oracle_df = pd.read_csv(
            MOCK_ORACLE_PATH
        )

        # todo: revisit this
        simulator_name = "apy_OracleSimulator"





