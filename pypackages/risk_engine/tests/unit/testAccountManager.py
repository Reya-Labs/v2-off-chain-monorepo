import unittest
from pypackages.risk_engine.tests.mocks.mockMarketManager import MockMarketManager
from pypackages.risk_engine.src.core.accountManager import AccountManager

class TestAccountManager(unittest.TestCase):
    def setUp(self):
        self.account_manager = AccountManager()
        self.account_manager.set_market_manager(market_manager=MockMarketManager())

    def test_register_account(self):
        self.account_manager.create_account(account_id="user_1", base_token="USDC")
        self.account_manager.create_account(account_id="user_2", base_token="USDC")

        retrieved_account = self.account_manager.get_account(account_id="user_1")
        self.assertAlmostEqual(retrieved_account.account_id, "user_1")

        retrieved_account = self.account_manager.get_account(account_id="user_2")
        self.assertAlmostEqual(retrieved_account.account_id, "user_2")

        with self.assertRaisesRegex(Exception, "Account Manager: Account not created"):
            self.account_manager.get_account(account_id="user_3")

        with self.assertRaisesRegex(Exception, "Account Manager: Account already created"):
            self.account_manager.create_account(account_id="user_1", base_token="USDC")


if __name__ == "__main__":
    unittest.main()
