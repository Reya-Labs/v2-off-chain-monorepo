from unittest.mock import Mock

from pypackages.risk_engine.src.core.liquidationModule import LiquidationModule


class MockLiquidationModule(LiquidationModule):
    def __init__(self):
        self.is_im_satisfied = Mock()

    def mock_is_im_satisfied(self, return_value):
        self.is_im_satisfied = Mock(return_value=return_value)
