from pypackages.risk_engine.src.core.account import Account

class AccountManager:
    def __init__(self):

        self._market_manager = None
        self._accounts = {}

    def set_market_manager(self, market_manager):
        self._market_manager = market_manager

    def get_market_manager(self):
        if self._market_manager is None:
            raise Exception("account manager: market manager not set")

        return self._market_manager

    def get_account(self, account_id):
        if account_id not in self._accounts:
            raise Exception("Account Manager: Account not created")

        return self._accounts[account_id]

    def create_account(self, account_id: str, base_token: str):

        # check if the account_id already exists
        if account_id in self._accounts:
            raise Exception("Account Manager: Account already created")

        # create the account
        new_account = Account(account_id=account_id, base_token=base_token)

        new_account.set_market_manager(market_manager=self.get_market_manager())

        # add the new account to the _accounts mapping
        self._accounts[account_id] = new_account

        return new_account