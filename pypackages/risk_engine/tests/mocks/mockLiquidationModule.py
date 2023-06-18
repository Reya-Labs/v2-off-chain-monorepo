from unittest.mock import Mock

from risk_engine.src.contracts.core.liquidationModule import LiquidationModule


class MockLiquidationModule(LiquidationModule):
    def __init__(self):
        self.is_im_satisfied = Mock()

    def mock_is_im_satisfied(self, return_value):
        self.is_im_satisfied = Mock(return_value=return_value)
