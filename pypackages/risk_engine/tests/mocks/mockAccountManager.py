from unittest.mock import Mock

from risk_engine.src.contracts.core import AccountManager


class MockAccountManager(AccountManager):
    def __init__(self):
        self.get_account = Mock()

    def mock_get_account(self, return_value):
        self.get_account = Mock(return_value=return_value)
