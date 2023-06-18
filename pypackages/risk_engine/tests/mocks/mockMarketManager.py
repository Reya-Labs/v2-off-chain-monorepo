from unittest import mock

from risk_engine.src.contracts.instruments.dated_irs import MarketManager


class MockMarketManager(MarketManager):
    def __init__(self):
        self.get_market_by_id = mock.Mock()

    def mock_get_market_by_id(self, return_value):
        self.get_market_by_id = mock.Mock(return_value=return_value)
