from typing import List

from pypackages.risk_engine.src.instruments.dated_irs.baseMarket import BaseMarket


class Account:
    def __init__(self, account_id: str, base_token: str):

        self.account_id = account_id
        self._base_token = base_token

        self._market_manager = None
        self._active_markets: List[BaseMarket] = []

    def set_market_manager(self, market_manager):
        self._market_manager = market_manager

    def get_market_manager(self):
        if self._market_manager is None:
            raise Exception("account: market manager not set")

        return self._market_manager

    def close_all_account_filled_and_unfilled_orders(self):

        for market_id, maturity in self._active_markets:
            market = self.get_market_manager().get_market_by_id(market_id=market_id)
            market.close_account(maturity=maturity, account_id=self.account_id)

    def mark_market(self, market_id, maturity):
        if not (market_id, maturity) in self._active_markets:
            self._active_markets.append((market_id, maturity))

    def get_account_unrealized_pnl(self):
        unrealized_pnl = 0.0

        for market_id, maturity in self._active_markets:
            market = self.get_market_manager().get_market_by_id(market_id=market_id)
            unrealized_pnl += market.get_unrealized_pnl_in_quote(
                maturity=maturity, account_id=self.account_id
            )

        return unrealized_pnl

    def get_annualized_filled_and_unfilled_orders(self):

        annualized_bases = []

        for market_id, maturity in self._active_markets:
            market = self.get_market_manager().get_market_by_id(market_id=market_id)
            (
                filled_base,
                unfilled_base_long,
                unfilled_base_short,
            ) = market.get_annualized_filled_and_unfilled_bases(
                maturity=maturity, account_id=self.account_id
            )

            tmp = {
                "market_id": market_id,
                "maturity": maturity,
                "filled": filled_base,
                "unfilled_long": unfilled_base_long,
                "unfilled_short": unfilled_base_short,
            }

            annualized_bases.append(tmp)

        return annualized_bases

    def get_base_token(self):
        return self._base_token
