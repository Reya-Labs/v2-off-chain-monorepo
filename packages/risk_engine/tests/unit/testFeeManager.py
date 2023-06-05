import unittest
from packages.risk_engine.src.core.feeManager import FeeManager


class TestFeeManager(unittest.TestCase):
    def setUp(self):
        self.fee_manager = FeeManager()

        self.fee_manager.set_atomic_maker_taker_fees(
            market_id="IRS_USDC", new_atomic_maker_fee=0.005, new_atomic_taker_fee=0.01
        )

        self.fee_manager.set_fee_collector_account_id_of_protocol(fee_collector_protocol="protocol")

    def test_get_atomic_fee_debits_and_credits_taker_positive_notional(self):
        debits_and_credits = self.fee_manager.get_atomic_fee_debits_and_credits(
            market_id="IRS_USDC", annualized_notional=1000, account_id="user", is_taker=True
        )

        self.assertEqual(
            debits_and_credits,
            [{"account_id": "user", "fee_cashflow": -10}, {"account_id": "protocol", "fee_cashflow": 10}],
        )

    def test_get_atomic_fee_debits_and_credits_taker_negative_notional(self):
        debits_and_credits = self.fee_manager.get_atomic_fee_debits_and_credits(
            market_id="IRS_USDC", annualized_notional=-1000, account_id="user", is_taker=True
        )

        self.assertEqual(
            debits_and_credits,
            [{"account_id": "user", "fee_cashflow": -10}, {"account_id": "protocol", "fee_cashflow": 10}],
        )

    def test_get_atomic_fee_debits_and_credits_maker(self):
        debits_and_credits = self.fee_manager.get_atomic_fee_debits_and_credits(
            market_id="IRS_USDC", annualized_notional=1000, account_id="user", is_taker=False
        )

        self.assertEqual(
            debits_and_credits,
            [{"account_id": "user", "fee_cashflow": -5}, {"account_id": "protocol", "fee_cashflow": 5}],
        )


if __name__ == "__main__":
    unittest.main()