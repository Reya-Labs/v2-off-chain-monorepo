import unittest
from risk_engine.src.slippage.runSlippageModelOptimization import run_slippage_model_optimization
from risk_engine.src.slippage.calculateSlippageModel import calculate_slippage_model
import pandas as pd
from pandas import Series

TRUE_BETA = 0.5
TRUE_PHI = 0.00001

class SlippageModelOptimizationTest(unittest.TestCase):

    def setUp(self):

        self.notional: Series = Series(
            data=[10.0, 100.0, 1000.0, 10000.0]
        )

        self.slippage =

    def test_run_slippage_model_optimization(self):

        pass