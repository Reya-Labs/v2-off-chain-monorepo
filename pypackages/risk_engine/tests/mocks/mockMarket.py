from unittest import mock

from risk_engine.src.contracts.instruments.dated_irs.baseMarket import BaseMarket


class MockMarket(BaseMarket):
    def __init__(self, market_id):
        self.market_id = market_id
        self.get_unrealized_pnl_in_quote = mock.Mock()
        self.get_annualized_filled_and_unfilled_bases = mock.Mock()
        self.base_to_USD_exchange_rate = mock.Mock()
        self.close_account = mock.Mock()

    def mock_get_unrealized_pnl_in_quote(self, return_value):
        self.get_unrealized_pnl_in_quote = mock.Mock(return_value=return_value)

    def mock_get_annualized_filled_and_unfilled_bases(self, return_value):
        self.get_annualized_filled_and_unfilled_bases = mock.Mock(
            return_value=return_value
        )

    def mock_base_to_USD_exchange_rate(self, return_value):
        self.base_to_USD_exchange_rate = mock.Mock(return_value=return_value)
