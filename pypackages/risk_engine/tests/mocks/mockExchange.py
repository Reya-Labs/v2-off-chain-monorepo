from unittest.mock import Mock

from risk_engine.src.exchanges.vamm.baseVAMMExchange import BaseVAMMExchange


class MockExchange(BaseVAMMExchange):
    def __init__(self, pool_id):
        self.pool_id = pool_id
        self.execute_limit_order = Mock()
        self.execute_market_order = Mock()
        self.get_account_filled_balances = Mock()
        self.get_account_filled_and_unfilled_balances = Mock()
        self.supported_maturities = Mock()
        self.gwap = Mock()
        self.close_positions = Mock()

    
    def _track_variable_tokens(self, base):
        raise Exception("mock pool: not implemented")

    
    def _track_fixed_tokens(self, base, tick_lower, tick_upper):
        raise Exception("mock pool: not implemented")

    def mock_supported_maturities(self, return_value):
        self.supported_maturities = Mock(return_value=return_value)

    def mock_execute_limit_order(self, return_value):
        self.execute_limit_order = Mock(return_value=return_value)

    def mock_execute_market_order(self, return_value):
        self.execute_market_order = Mock(return_value=return_value)

    def mock_get_account_filled_balances(self, return_value):
        self.get_account_filled_balances = Mock(return_value=return_value)

    def mock_get_account_filled_and_unfilled_balances(self, return_value):
        self.get_account_filled_and_unfilled_balances = Mock(return_value=return_value)

    def mock_gwap(self, return_value):
        self.gwap = Mock(return_value=return_value)

    def mock_close_positions(self, return_value):
        self.close_positions = Mock(return_value=return_value)
