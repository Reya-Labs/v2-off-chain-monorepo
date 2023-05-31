import math
from abc import abstractmethod


class BaseMarket:
    def __init__(
        self,
        block,
        market_id,
        base_token,
        quote_token,
    ):
        """
        # note: a list of whitelisted fee tokens
        """

        self.market_id = market_id
        self._base_token = base_token
        self._quote_token = quote_token

        self.block = block

        # note: introduce oracle manager
        self._oracle = None
        self._collateral_engine = None
        self._liquidation_engine = None
        self._account_manager = None
        self._fee_manager = None
        self._price_oracle = None

        # thought: introduce pool manager
        self._registered_pools = {}

        self._base_balance_per_maturity = {}
        self._quote_balance_per_maturity = {}

        # pool used when closing positions
        self._default_pool_id = None

        self.slippage_phi = 0
        self.slippage_beta = 1

    # Abstract methods
    @abstractmethod
    def _annualize(self, bases, maturity):
        """
        it computes the annualized notional given base
        """

        pass

    @abstractmethod
    def get_unrealized_pnl_in_quote(self, maturity, account_id):
        pass

    # Internal functions
    def _process_maker_taker_fees(self, maturity, account_id, executed_base_amount, is_taker):

        """

        :param account_id:
        :param executed_base_amount:
        :param is_taker:
        :return:
        """

        # annualized notional in fee token terms
        [annualized_notional] = self._annualize(bases=[executed_base_amount], maturity=maturity)

        """
            in theory fee distribution can be batched and delegated to avoid two steps below from gas cost perspective
            also, as noted above in the process_limit_order function, do we need to .mark_market within this function?
        """

        fee_debits_and_credits_in_fee_token = self.get_fee_manager().get_atomic_fee_debits_and_credits(
            market_id=self.market_id,
            annualized_notional=annualized_notional,
            account_id=account_id,
            is_taker=is_taker,
        )

        self.get_collateral_engine().distribute_fees(
            fee_debits_and_credits=fee_debits_and_credits_in_fee_token
        )

        return fee_debits_and_credits_in_fee_token

    def _update_base_balance_per_maturity(self, maturity, account_id, amount):
        if maturity not in self._base_balance_per_maturity:
            self._base_balance_per_maturity.update({maturity: {}})

        if account_id not in self._base_balance_per_maturity[maturity]:
            self._base_balance_per_maturity[maturity].update({account_id: 0})

        self._base_balance_per_maturity[maturity][account_id] += amount

    def _update_quote_balance_per_maturity(self, maturity, account_id, amount):
        if maturity not in self._quote_balance_per_maturity:
            self._quote_balance_per_maturity.update({maturity: {}})

        if account_id not in self._quote_balance_per_maturity[maturity]:
            self._quote_balance_per_maturity[maturity].update({account_id: 0})

        self._quote_balance_per_maturity[maturity][account_id] += amount

    # External functions
    def process_limit_order(self, pool_id, maturity, account_id, base, lower_price, upper_price):
        """
        Limit order encapsulates any type of lp order that's atomic on chain.
        price_lower and price_upper are optional arguments (e.g. there might be pools that are fully managed
        and don't expect inputs from the user)
        :param account_id:
        :param pool_id:
        :param base:
        :param lower_price:
        :param upper_price:
        :return:
        """

        pool = self.get_pool_by_id(pool_id=pool_id)
        account = self.get_account_manager().get_account(account_id)

        if not account.get_base_token() == self._quote_token:
            raise Exception("account token does not correspond to quote token")

        executed_base_amount = pool.execute_limit_order(
            maturity=maturity,
            account_id=account_id,
            base=base,
            lower_price=lower_price,
            upper_price=upper_price,
        )

        account.mark_market(market_id=self.market_id, maturity=maturity)

        # process fees
        fee_debits_and_credits_in_fee_token = self._process_maker_taker_fees(
            maturity=maturity,
            account_id=account_id,
            executed_base_amount=executed_base_amount,
            is_taker=False,
        )

        # check the margin requirement of the account that executed this trade
        is_IM_satisfied = self.get_liquidation_engine().is_IM_satisfied(account_id=account_id)

        if not is_IM_satisfied:
            raise Exception("Initial margin requirement of the account_id is not satisfied")

        return executed_base_amount, fee_debits_and_credits_in_fee_token

    def process_market_order(self, pool_id, maturity, account_id, base):
        """
        this function is able to issue both negative and positive amounts of base+quote tokens
        no price limit in this implementation
        the sign of base determines the direction (LONG or SHORT)
        execute the trade against a given pool with a unique pool_id

        atomic orders

        atomic orders allow users to open, close, or modify a position atomically (i.e. within a single transaction and
        without the need for keepers)

        delayed orders (out of scope)

        delayed orders are async, time based orders. Rather than opening a position with a single transaction,
        an order is created in one transaction and then executed in a separate transaction in the future, hence
        async and delayed.

        delayed off-chain orders (out of scope)

        similar to delayed orders, off-chain orders also follow a familiar interface and operate asynchronously.
        from an integration standpoint, this is almost exactly the same as delayed orders with the exception of a
        differing function name and execution

        since off-chain orders require off-chain prices, price feed data needs to be submitted upon execution.
        off-chain prices can be queried against https://pyth.network/price-feeds and pass into executeOffchainOrder,
        on-chain we perform a variety of checks and if all pass, the order is executed and position is opened

        :param maturity:
        :param account_id:
        :param pool_id:
        :param base:
        :return:
        """

        # execute the market order in the pool and propagate information to the pool
        pool = self.get_pool_by_id(pool_id=pool_id)
        account = self.get_account_manager().get_account(account_id)

        if not account.get_base_token() == self._quote_token:
            raise Exception("account token does not correspond to quote token")

        executed_base_amount, executed_quote_amount = pool.execute_market_order(maturity=maturity, base=base)

        self._update_base_balance_per_maturity(
            maturity=maturity, account_id=account_id, amount=executed_base_amount
        )
        self._update_quote_balance_per_maturity(
            maturity=maturity, account_id=account_id, amount=executed_quote_amount
        )

        account.mark_market(market_id=self.market_id, maturity=maturity)

        taker_fee_debits_and_credits_in_fee_token = self._process_maker_taker_fees(
            maturity=maturity,
            account_id=account_id,
            executed_base_amount=executed_base_amount,
            is_taker=True,
        )

        # check the margin requirement of the account that executed this trade
        is_IM_satisfied = self.get_liquidation_engine().is_IM_satisfied(account_id=account_id)

        if not is_IM_satisfied:
            raise Exception("Initial margin requirement of the account_id is not satisfied")

        return executed_base_amount, executed_quote_amount, taker_fee_debits_and_credits_in_fee_token

    def route_market_order(self, maturity, account_id, base):
        default_pool_id = self.get_default_pool_id()

        executed_base_amount, executed_quote_amount, _ = self.process_market_order(
            pool_id=default_pool_id,
            maturity=maturity,
            account_id=account_id,
            base=base,
        )
        return executed_base_amount, executed_quote_amount

    def close_account(self, maturity, account_id):
        # close limit order positions and get the unfilled base and quote
        for pool_id in self._registered_pools:
            pool = self.get_pool_by_id(pool_id=pool_id)

            if maturity not in pool.supported_maturities():
                continue

            (closed_base, closed_quote) = pool.close_positions(maturity=maturity, account_id=account_id)

            self._update_base_balance_per_maturity(
                maturity=maturity, account_id=account_id, amount=closed_base
            )

            self._update_quote_balance_per_maturity(
                maturity=maturity, account_id=account_id, amount=closed_quote
            )

        pending_base = self._base_balance_per_maturity[maturity][account_id]

        # close filled base exposure
        self.route_market_order(maturity=maturity, account_id=account_id, base=-pending_base)

    def settle(self, maturity, account_id):
        aggregate_base = self.get_base_balance_per_maturity(maturity=maturity, account_id=account_id)
        aggregate_quote = self.get_quote_balance_per_maturity(maturity=maturity, account_id=account_id)

        self._update_base_balance_per_maturity(
            maturity=maturity, account_id=account_id, amount=-aggregate_base
        )
        self._update_quote_balance_per_maturity(
            maturity=maturity, account_id=account_id, amount=-aggregate_quote
        )

        for pool_id in self._registered_pools:
            pool = self.get_pool_by_id(pool_id=pool_id)

            if maturity not in pool.supported_maturities():
                continue

            base, quote = pool.close_positions(maturity=maturity, account_id=account_id)

            aggregate_base += base
            aggregate_quote += quote

        if aggregate_quote == 0 and aggregate_base == 0:
            return

        settlement_cashflow_in_quote = self.settlement_cashflow(
            maturity=maturity, base=aggregate_base, quote=aggregate_quote
        )
        self.get_collateral_engine().cashflow_propagation(
            account_id=account_id, amount=settlement_cashflow_in_quote
        )

    # Setters
    def set_oracle(self, oracle):
        self._oracle = oracle

    def set_collateral_engine(self, collateral_engine):
        self._collateral_engine = collateral_engine

    def set_liquidation_engine(self, liquidation_engine):
        self._liquidation_engine = liquidation_engine

    def set_account_manager(self, account_manager):
        self._account_manager = account_manager

    def set_fee_manager(self, fee_manager):
        self._fee_manager = fee_manager

    def set_price_oracle(self, price_oracle):
        self._price_oracle = price_oracle

    def set_default_pool_id(self, default_pool_id):
        self._default_pool_id = default_pool_id

    def set_slippage_phi(self, slippage_phi):
        self.slippage_phi = slippage_phi

    def set_slippage_beta(self, slippage_beta):
        self.slippage_beta = slippage_beta

    def register_pool(self, pool):
        if pool.pool_id in self._registered_pools:
            raise Exception("Market: Pool already registered")
        self._registered_pools.update({pool.pool_id: pool})

    # Getters
    def settlement_cashflow(self, maturity, base, quote):
        return base * self.get_oracle().snapshot(timestamp=maturity) + quote

    def aggregate_gwap(self, maturity, base=0):
        """
        It returns the aggregated gwap of all markets.
        It currently computes the average but this is subject to change.
        """

        gwaps = []
        for pool_id in self._registered_pools:
            pool = self.get_pool_by_id(pool_id=pool_id)

            if maturity not in pool.supported_maturities():
                continue

            gwaps.append(pool.gwap(maturity=maturity))

        if len(gwaps) == 0:
            raise Exception("base market: no markets with this maturity")

        price = sum(gwaps) / len(gwaps)

        if abs(base) > 0:
            slippage = self.slippage_phi * math.pow(abs(base), self.slippage_beta)

            if base < 0:
                price *= 1 - slippage
            else:
                price *= 1 + slippage

        return price

    def get_account_filled_balances(self, maturity, account_id):
        aggregate_base = self.get_base_balance_per_maturity(maturity=maturity, account_id=account_id)
        aggregate_quote = self.get_quote_balance_per_maturity(maturity=maturity, account_id=account_id)

        for pool_id in self._registered_pools:
            pool = self.get_pool_by_id(pool_id=pool_id)

            if maturity not in pool.supported_maturities():
                continue

            base, quote = pool.get_account_filled_balances(maturity=maturity, account_id=account_id)

            aggregate_base += base
            aggregate_quote += quote

        return aggregate_base, aggregate_quote

    def get_account_filled_and_unfilled_balances(self, maturity, account_id):
        aggregate_base = self.get_base_balance_per_maturity(maturity=maturity, account_id=account_id)
        aggregate_quote = self.get_quote_balance_per_maturity(maturity=maturity, account_id=account_id)
        aggregate_unfilled_base_long = 0
        aggregate_unfilled_base_short = 0

        for pool_id in self._registered_pools:
            pool = self.get_pool_by_id(pool_id=pool_id)

            if maturity not in pool.supported_maturities():
                continue

            (
                base,
                quote,
                unfilled_base_long,
                unfilled_base_short,
            ) = pool.get_account_filled_and_unfilled_balances(maturity=maturity, account_id=account_id)

            aggregate_base += base
            aggregate_quote += quote
            aggregate_unfilled_base_long += unfilled_base_long
            aggregate_unfilled_base_short += unfilled_base_short

        return aggregate_base, aggregate_quote, aggregate_unfilled_base_long, aggregate_unfilled_base_short

    def get_annualized_filled_and_unfilled_bases(self, maturity, account_id):
        (
            filled_base,
            _,
            unfilled_base_long,
            unfilled_base_short,
        ) = self.get_account_filled_and_unfilled_balances(maturity=maturity, account_id=account_id)

        [
            annualized_filled_base,
            annualized_unfilled_base_long,
            annualized_unfilled_base_short,
        ] = self._annualize(bases=[filled_base, unfilled_base_long, unfilled_base_short], maturity=maturity)

        return (
            annualized_filled_base,
            annualized_unfilled_base_long,
            annualized_unfilled_base_short,
        )

    def base_to_token_exchange_rate(self, token_type):
        return self.get_price_oracle().get_price(token_in=self._base_token, token_out=token_type)

    def get_oracle(self):
        if self._oracle is None:
            raise Exception("base market: oracle not set")

        return self._oracle

    def get_collateral_engine(self):
        if self._collateral_engine is None:
            raise Exception("base market: collateral engine not set")

        return self._collateral_engine

    def get_liquidation_engine(self):
        if self._liquidation_engine is None:
            raise Exception("base market: liquidation engine not set")

        return self._liquidation_engine

    def get_account_manager(self):
        if self._account_manager is None:
            raise Exception("base market: account manager not set")

        return self._account_manager

    def get_fee_manager(self):
        if self._fee_manager is None:
            raise Exception("base market: fee manager not set")

        return self._fee_manager

    def get_price_oracle(self):
        if self._price_oracle is None:
            raise Exception("base market: price oracle not set")

        return self._price_oracle

    def get_default_pool_id(self):
        if self._default_pool_id is None:
            raise Exception("base market: default pool id has not been set")
        return self._default_pool_id

    def get_base_balance_per_maturity(self, maturity, account_id):
        if maturity not in self._base_balance_per_maturity:
            return 0

        if account_id not in self._base_balance_per_maturity[maturity]:
            return 0

        return self._base_balance_per_maturity[maturity][account_id]

    def get_quote_balance_per_maturity(self, maturity, account_id):
        if maturity not in self._quote_balance_per_maturity:
            return 0

        if account_id not in self._quote_balance_per_maturity[maturity]:
            return 0

        return self._quote_balance_per_maturity[maturity][account_id]

    def get_pool_by_id(self, pool_id):
        if pool_id not in self._registered_pools:
            raise Exception("Market: Pool not registered")
        return self._registered_pools[pool_id]