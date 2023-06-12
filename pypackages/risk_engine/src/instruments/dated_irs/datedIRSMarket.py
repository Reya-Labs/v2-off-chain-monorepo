from typing_extensions import override

from risk_engine.src.constants import YEAR_IN_SECONDS

from .baseMarket import BaseMarket


class DatedIRSMarket(BaseMarket):
    def __init__(
        self, block, market_id="irs_market", base_token="USDC", quote_token="USDC"
    ):
        super().__init__(
            block=block,
            market_id=market_id,
            base_token=base_token,
            quote_token=quote_token,
        )

    @override
    def _annualize(self, bases, maturity):
        time_factor = max(0, (maturity - self.block.timestamp) / YEAR_IN_SECONDS)
        li = self._oracle.latest()

        return list(map(lambda x: (x * time_factor * li), bases))

    @override
    def get_unrealized_pnl_in_quote(self, maturity, account_id):
        base, quote = self.get_account_filled_balances(
            maturity=maturity, account_id=account_id
        )

        time_delta = max(0, (maturity - self.block.timestamp) / YEAR_IN_SECONDS)
        unwind_quote = (
            base
            * self._oracle.latest()
            * (self.aggregate_gwap(maturity=maturity) * time_delta + 1)
        )

        return quote + unwind_quote
