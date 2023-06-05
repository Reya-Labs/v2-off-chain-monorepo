from unittest.mock import Mock
from packages.risk_engine.src.core.collateralModule import CollateralModule


class MockCollateralModule(CollateralModule):
    def __init__(self):
        self.distribute_fees = Mock()
        self.cashflow_propagation = Mock()
        self.get_account_total_value = Mock()
        # self.get_collateral_to_USD_exchange_rate = Mock()
        self._update_account_collateral = Mock()
        # consider mocking as well
        self._account_collateral_balance_mapping = {}

    def mock_get_account_total_value(self, return_value):
        self.get_account_total_value = Mock(return_value=return_value)

    # def mock_get_collateral_to_USD_exchange_rate(self, return_value):
    #     self.get_collateral_to_USD_exchange_rate = Mock(return_value=return_value)