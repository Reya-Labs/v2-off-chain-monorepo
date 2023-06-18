from unittest.mock import Mock

from risk_engine.src.contracts.core.feeManager import FeeManager


class MockFeeManager(FeeManager):
    def __init__(self):
        self.get_atomic_fee_debits_and_credits: Mock = Mock()

    def mock_get_atomic_fee_debits_and_credits(self, return_value):
        self.get_atomic_fee_debits_and_credits: Mock = Mock(return_value=return_value)
