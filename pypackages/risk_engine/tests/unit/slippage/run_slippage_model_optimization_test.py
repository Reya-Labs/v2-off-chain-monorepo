import unittest
from risk_engine.src.slippage.runSlippageModelOptimization import run_slippage_model_optimization
import pandas as pd
from pandas import Series

TRUE_BETA = 0.5
TRUE_PHI = 0.00001

class SlippageModelOptimizationTest(unittest.TestCase):

    def setUp(self):

        self.notional: Series = Series(
            data=[10.0, 100.0, 1000.0, 10000.0]
        )

    def test_run_slippage_model_optimization(self):

        pass