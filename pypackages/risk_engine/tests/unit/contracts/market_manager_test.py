import unittest

from risk_engine.src.contracts.instruments.dated_irs import MarketManager
from risk_engine.tests.mocks.mockMarket import MockMarket


class TestMarketManager(unittest.TestCase):
    def setUp(self):
        self.market_manager = MarketManager()

    def test_register_market_manager(self):
        market1 = MockMarket(market_id="IRS")
        market2 = MockMarket(market_id="DatedFutures")

        self.market_manager.register_market(market=market1)
        self.market_manager.register_market(market=market2)

        retrieved_market = self.market_manager.get_market_by_id(
            market_id=market1.market_id
        )
        self.assertAlmostEqual(retrieved_market, market1)

        retrieved_market = self.market_manager.get_market_by_id(
            market_id=market2.market_id
        )
        self.assertAlmostEqual(retrieved_market, market2)

        with self.assertRaisesRegex(
            Exception, "Market Manager: Market already registered"
        ):
            self.market_manager.register_market(market=market1)

        with self.assertRaisesRegex(Exception, "Market Manager: Market not registered"):
            self.market_manager.get_market_by_id(market_id="no_market")


if __name__ == "__main__":
    unittest.main()
