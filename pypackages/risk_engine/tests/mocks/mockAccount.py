from unittest.mock import Mock

from pypackages.risk_engine.src.core.account import Account


class MockAccount(Account):
    def __init__(self, account_id):
        self.account_id = account_id
        self.mark_market: Mock = Mock()
        self.get_account_unrealized_pnl: Mock = Mock()
        self.get_annualized_filled_and_unfilled_orders: Mock = Mock()
        self.close_all_account_filled_and_unfilled_orders: Mock = Mock()
        self.get_base_token: Mock = Mock()

    def mock_get_account_unrealized_pnl(self, return_value):
        self.get_account_unrealized_pnl = Mock(return_value=return_value)

    def mock_get_annualized_filled_and_unfilled_orders(self, return_value):
        self.get_annualized_filled_and_unfilled_orders = Mock(return_value=return_value)

    def mock_get_base_token(self, return_value):
        self.get_base_token = Mock(return_value=return_value)
