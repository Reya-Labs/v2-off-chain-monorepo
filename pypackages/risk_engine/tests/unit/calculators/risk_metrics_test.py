import unittest

from risk_engine.src.calculators.RiskMetrics import RiskMetrics


class TestAccountManager(unittest.TestCase):
    def setUp(self):
        # todo: dependency on a dataframe
        self.riskMetrics = RiskMetrics(None)

    def test_insolvency_calculation(self):
        pass

    def test_liquidation_calculation(self):
        pass

    def test_generate_replicates(self):

        pass

    def test_lvar_and_ivar_calculation(self):

        pass


if __name__ == "__main__":
    unittest.main()
