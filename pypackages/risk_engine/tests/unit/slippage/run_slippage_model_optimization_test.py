import unittest
from risk_engine.src.slippage.runSlippageModelOptimization import run_slippage_model_optimization
from risk_engine.src.slippage.calculateSlippageModel import calculate_slippage_model
from pandas import Series
from risk_engine.src.slippage.slippageModelParameters import SlippageModelParameters

TRUE_SLIPPAGE_BETA = 0.5
TRUE_SLIPPAGE_PHI = 0.00001

class SlippageModelOptimizationTest(unittest.TestCase):

    def setUp(self):

        self.true_slippage_model_parameters = SlippageModelParameters(
            slippage_phi=TRUE_SLIPPAGE_PHI,
            slippage_beta=TRUE_SLIPPAGE_BETA
        )

        self.notional: Series = Series(
            data=[10.0, 100.0, 1000.0, 10000.0]
        )

        self.slippage: Series = calculate_slippage_model(
            slippage_model_parameters=self.true_slippage_model_parameters,
            notional_in_quote=self.notional
        )

    def test_run_slippage_model_optimization(self):

        estimated_slippage_model_parametesr = run_slippage_model_optimization(
            slippage=self.slippage,
            notional=self.notional
        )

        self.assertAlmostEqual(estimated_slippage_model_parametesr.slippage_beta, TRUE_SLIPPAGE_BETA)
        self.assertAlmostEqual(estimated_slippage_model_parametesr.slippage_phi, TRUE_SLIPPAGE_PHI)