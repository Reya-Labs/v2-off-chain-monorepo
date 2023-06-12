class MarketManager:
    def __init__(self):
        self._registered_markets = {}

    def register_market(self, market):
        market_id = market.market_id

        if market_id in self._registered_markets:
            raise Exception("Market Manager: Market already registered")

        self._registered_markets.update({market_id: market})

    def get_market_by_id(self, market_id):
        if market_id not in self._registered_markets:
            raise Exception("Market Manager: Market not registered")
        return self._registered_markets[market_id]
