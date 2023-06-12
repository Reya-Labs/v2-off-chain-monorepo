# todo: add typigns
class FeeManager:
    def __init__(self):

        self._atomic_maker_fee_per_market = {}
        self._atomic_taker_fee_per_market = {}

        self._fee_collector_protocol = None

    def get_atomic_fee_debits_and_credits(
        self, market_id, annualized_notional, account_id, is_taker
    ):

        fee_amount = abs(annualized_notional) * (
            self._atomic_taker_fee_per_market[market_id]
            if is_taker
            else self._atomic_maker_fee_per_market[market_id]
        )

        debits_and_credits = [
            {"account_id": account_id, "fee_cashflow": -fee_amount},
            {
                "account_id": self.get_fee_collector_account_id_of_protocol(),
                "fee_cashflow": fee_amount,
            },
        ]

        return debits_and_credits

    def set_atomic_maker_taker_fees(
        self, market_id, new_atomic_maker_fee, new_atomic_taker_fee
    ):

        self._atomic_maker_fee_per_market.update({market_id: new_atomic_maker_fee})

        self._atomic_taker_fee_per_market.update({market_id: new_atomic_taker_fee})

    def get_atomic_maker_taker_fees(self, market_id):

        if (
            market_id not in self._atomic_maker_fee_per_market
            or market_id not in self._atomic_taker_fee_per_market
        ):
            raise Exception(
                "fee manager: maker taker fees not set for {0}".format(market_id)
            )

        return (
            self._atomic_maker_fee_per_market[market_id],
            self._atomic_taker_fee_per_market[market_id],
        )

    def set_fee_collector_account_id_of_protocol(self, fee_collector_protocol):

        self._fee_collector_protocol = fee_collector_protocol

    def get_fee_collector_account_id_of_protocol(self):
        if self._fee_collector_protocol is None:
            raise Exception("fee manager: protocol collector not set")

        return self._fee_collector_protocol
