import datetime
import os

import matplotlib.pyplot as plt
import pandas as pd


from risk_engine.src.contracts.core.accountManager import AccountManager
from risk_engine.src.evm.block import Block
from risk_engine.src.contracts.core.feeManager import FeeManager
from risk_engine.src.contracts.core.collateralModule import CollateralModule
from risk_engine.src.contracts.core.liquidationModule import LiquidationModule
from risk_engine.src.contracts.instruments.dated_irs.datedIRSMarket import DatedIRSMarket
from risk_engine.src.contracts.instruments.dated_irs.marketManager import MarketManager
from risk_engine.src.contracts.oracles.oracle import Oracle
from risk_engine.src.contracts.exchanges.vamm.datedIRSVAMMExchange import DatedIRSVAMMExchange
from risk_engine.src.optimization.configurations import ProtocolRiskConfiguration, MarketRiskConfiguration, LiquidationConfiguration, MarketFeeConfiguration, DatedIRSMarketConfiguration, VAMMConfiguration
from risk_engine.src.constants import DAY_IN_SECONDS


"""
This simulation has the following assumptions and series of actions:
    - There's one market and one pool on top of given interest indices

    - There are two actors, Alice (maker) and Bob(taker)
    - Alice mints liquidity in the pool
    - Bob trades

    - The simulation checks the margin requirements and uPnL over time
"""


class MarginRequirements:

    def setUp(
        self,
        initial_fixed_rate: float,
        is_trader_vt: bool,
        timestamps: list[int],
        indices: list[float],
        protocol_risk_configuration: ProtocolRiskConfiguration,
        market_risk_configuration: MarketRiskConfiguration,
        liquidation_configuration: LiquidationConfiguration,
        market_fee_configuration: MarketFeeConfiguration,
        dated_irs_market_configuration: DatedIRSMarketConfiguration,
        vamm_configuration: VAMMConfiguration
    ):
        # Generate the modules
        self.block: Block = Block(relative_block_position=0)

        # Sanity check the indices
        if not len(timestamps) == len(indices):
            raise Exception("margin requirements: timestamps and indices do not have same length")

        if not (dated_irs_market_configuration.quote_token == "ETH" or dated_irs_market_configuration.quote_token == "USDC"):
            raise Exception("margin requirements: token {0} is not supported yet".format(dated_irs_market_configuration.quote_token))

        for i in range(1, len(timestamps)):
            if timestamps[i - 1] > timestamps[i]:
                raise Exception(
                    "margin requirements: timestamps are not chronological. (indices {0}-{1})".format(
                        i - 1, i
                    )
                )

        self.observations: list[list[int | float]] = []
        for i in range(len(timestamps)):
            self.observations.append([timestamps[i], indices[i]])

        # using the penultimate row as the maturity
        self.pool_irs_maturity = self.observations[-2][0]

        # Build the infrastructure
        self.oracle = Oracle(block=self.block, initial_observations=[])

        self.block.skip_forward_time(time_to_move_forward=self.observations[0][0] - self.block.timestamp)
        self.oracle.capture_rate(rate=self.observations[0][1])

        self.current_observation_index = 0

        self.account_manager = AccountManager()
        self.fee_manager = FeeManager()
        self.collateral_module = CollateralModule()
        self.liquidation_module = LiquidationModule(im_multiplier=protocol_risk_configuration.im_multiplier, liquidator_reward_proportion_of_im_delta=liquidation_configuration.liquidator_reward_parameter)
        self.market_manager = MarketManager()

        # Set up the account manager
        self.account_manager.set_market_manager(market_manager=self.market_manager)

        # Set up the fee manager
        self.fee_manager.set_fee_collector_account_id_of_protocol(fee_collector_protocol="protocol")

        self.fee_manager.set_atomic_maker_taker_fees(
            market_id="market_irs",
            # 0% maker fees
            new_atomic_maker_fee=market_fee_configuration.maker_fee_parameter,
            # 0% taker fees
            new_atomic_taker_fee=market_fee_configuration.taker_fee_parameter,
        )

        # Set up IRS market
        self.market_irs = DatedIRSMarket(
            block=self.block,
            market_id="market_irs",
            base_token=dated_irs_market_configuration.quote_token, # temp
            quote_token=dated_irs_market_configuration.quote_token,
        )

        self.market_irs.set_collateral_module(collateral_module=self.collateral_module)
        self.market_irs.set_liquidation_module(liquidation_module=self.liquidation_module)
        self.market_irs.set_oracle(oracle=self.oracle)
        self.market_irs.set_account_manager(account_manager=self.account_manager)
        self.market_irs.set_fee_manager(fee_manager=self.fee_manager)

        self.pool_irs = DatedIRSVAMMExchange(
            pool_id="pool_irs",
            block=self.block,
            min_tick=0,
            max_tick=100000,
            tick_spacing=10,
            term_end_in_seconds=self.pool_irs_maturity,
            oracle=self.oracle,
            gwap_lookback_in_seconds=market_risk_configuration.twapLookbackWindowInDays * DAY_IN_SECONDS
        )

        initial_tick = self.pool_irs.tick_at_price(initial_fixed_rate)
        self.pool_irs.initialize(current_tick=initial_tick)

        self.initial_fixed_rate = self.pool_irs.price_at_tick(tick=initial_tick)

        self.market_irs.register_pool(pool=self.pool_irs)

        self.market_irs.set_slippage_phi(slippage_phi=vamm_configuration.slippage_model_parameters.slippage_phi)
        self.market_irs.set_slippage_beta(slippage_beta=vamm_configuration.slippage_model_parameters.slippage_beta)

        # Set up market manager
        self.market_manager.register_market(market=self.market_irs)

        # Set up account
        self.alice = self.account_manager.create_account(account_id="alice", base_token=dated_irs_market_configuration.quote_token)

        self.bob = self.account_manager.create_account(account_id="bob", base_token=dated_irs_market_configuration.quote_token)

        # Set up risk mapping
        # todo: hmm, why is the risk parameter setting per maturity, needs to be investigated
        self.liquidation_module.set_risk_mapping(
            risk_mapping={"market_irs": {self.pool_irs_maturity: market_risk_configuration.risk_parameter}}
        )

        # Store the simulation metrics
        self.lp_spread = vamm_configuration.lp_spread
        self.is_trader_vt = is_trader_vt

    def advance_to_next_observation(self):
        if self.current_observation_index + 1 == len(self.observations):
            raise Exception("margin requirements: no more observations to advance")

        time_to_move_forward = (
            self.observations[self.current_observation_index + 1][0]
            - self.observations[self.current_observation_index][0]
        )

        # System: Advance time
        self.block.skip_forward_time(time_to_move_forward=time_to_move_forward)

        # System: Set new rate
        self.oracle.capture_rate(rate=self.observations[self.current_observation_index + 1][1])

        self.current_observation_index += 1

    def settle_actor_positions(self, actor_account_id: str, counterparty_account_id: str) -> tuple[float, float]:

        # todo: consider generalizing this via the perform actions function

        actor_collateral_balance_before_settlement = self.collateral_module.get_account_collateral_balance(account_id=actor_account_id)
        self.market_irs.settle(maturity=self.pool_irs_maturity, account_id=actor_account_id)
        actor_collateral_balance_after_settlement = self.collateral_module.get_account_collateral_balance(account_id=actor_account_id)
        actor_settlement_cashflow = actor_collateral_balance_after_settlement - actor_collateral_balance_before_settlement

        counterparty_collateral_balance_before_settlement = self.collateral_module.get_account_collateral_balance(account_id=counterparty_account_id)
        self.market_irs.settle(maturity=self.pool_irs_maturity, account_id=counterparty_account_id)
        counterparty_collateral_balance_after_settlement = self.collateral_module.get_account_collateral_balance(account_id=counterparty_account_id)
        counterparty_settlement_cashflow =counterparty_collateral_balance_after_settlement - counterparty_collateral_balance_before_settlement

        return actor_settlement_cashflow, counterparty_settlement_cashflow


    def initiate_actor_positions(self, actor_account_id: str, counterparty_account_id: str):

        # todo: consider introducing a stateless execute_actions function that takes a list of actions
        # such as deposit, provide liquidity, trade, etc

        # Alice: Deposit margin
        alice_collateral = 1000
        self.collateral_module.deposit_collateral(account_id=actor_account_id, amount=alice_collateral)

        # Alice: Mint between [F-spread, F+spread] on IRS market
        lp_notional = 10000

        self.market_irs.process_limit_order(
            pool_id="pool_irs",
            maturity=self.pool_irs_maturity,
            account_id=actor_account_id,
            base=lp_notional / self.oracle.latest(),
            lower_price=self.initial_fixed_rate - self.lp_spread,
            upper_price=self.initial_fixed_rate + self.lp_spread,
        )

        # Bob: Deposit margin
        bob_collateral = 1000
        self.collateral_module.deposit_collateral(account_id=counterparty_account_id, amount=bob_collateral)

        # Bob: Trade
        trade_notional = 1000 if self.is_trader_vt else -1000

        self.market_irs.process_market_order(
            pool_id="pool_irs",
            maturity=self.pool_irs_maturity,
            account_id=counterparty_account_id,
            base=trade_notional / self.oracle.latest(),
        )

    def run_event_loop(self) -> pd.DataFrame:

        output: pd.DataFrame = pd.DataFrame()
        timestamps: list[int] = []
        lp_liquidation_threshold: list[float] = []
        lp_safety_threshold: list[float] = []
        lp_uPnL: list[float] = []
        lp_margin: list[float] = []
        trader_liquidation_threshold: list[float] = []
        trader_safety_threshold: list[float] = []
        trader_uPnL: list[float] = []
        trader_margin: list[float] = []

        while self.current_observation_index + 1 < len(self.observations):
            alice_st, alice_lt = self.liquidation_module.get_account_margin_requirements(account_id="alice", account_manager=self.account_manager)
            bob_st, bob_lt = self.liquidation_module.get_account_margin_requirements(account_id="bob", account_manager=self.account_manager)
            alice_collateral_balance = self.collateral_module.get_account_collateral_balance(account_id="alice")
            bob_collateral_balance = self.collateral_module.get_account_collateral_balance(account_id='bob')

            alice_uPnL = self.account_manager.get_account(account_id="alice").get_account_unrealized_pnl()
            bob_uPnL = self.account_manager.get_account(account_id="bob").get_account_unrealized_pnl()

            timestamps.append(self.block.timestamp)
            lp_liquidation_threshold.append(alice_lt)
            lp_safety_threshold.append(alice_st)
            lp_uPnL.append(alice_uPnL)
            lp_margin.append(alice_collateral_balance)
            trader_liquidation_threshold.append(bob_lt)
            trader_safety_threshold.append(bob_st)
            trader_uPnL.append(bob_uPnL)
            trader_margin.append(bob_collateral_balance)

            # System: Advance 1 day
            self.advance_to_next_observation()

        output["timestamp"] = timestamps
        output["date"] = [datetime.datetime.fromtimestamp(ts) for ts in timestamps]
        output["lp_liquidation_threshold"] = lp_liquidation_threshold
        output["lp_safety_threshold"] = lp_safety_threshold
        output["lp_uPnL"] = lp_uPnL
        output["lp_margin"] = lp_margin
        output["trader_liquidation_threshold"] = trader_liquidation_threshold
        output["trader_safety_threshold"] = trader_safety_threshold
        output["trader_uPnL"] = trader_uPnL
        output["trader_margin"] = trader_margin

        return output

    def generate_output_plots(self, output: pd.DataFrame, output_folder: str):

        output.plot(x="date", y=["lp_liquidation_threshold", "lp_safety_threshold"])
        plt.savefig("{0}/lp_margin_requirements.png".format(output_folder))
        plt.cla()

        output.plot(x="date", y=["trader_liquidation_threshold", "trader_safety_threshold"])
        plt.savefig("{0}/trader_margin_requirements.png".format(output_folder))
        plt.cla()

        output.plot(x="date", y=["lp_uPnL", "lp_settlement_cashflow"])
        plt.savefig("{0}/lp_cashflows.png".format(output_folder))
        plt.cla()

        output.plot(x="date", y=["trader_uPnL", "trader_settlement_cashflow"])
        plt.savefig("{0}/trader_cashflows.png".format(output_folder))
        plt.cla()


    def run(self, output_folder) -> pd.DataFrame:

        self.initiate_actor_positions(actor_account_id=self.bob.account_id, counterparty_account_id=self.alice.account_id)
        output: pd.DataFrame = self.run_event_loop()
        actor_settlement_cashflow, counterparty_settlement_cashflow = self.settle_actor_positions(
            actor_account_id=self.bob.account_id,
            counterparty_account_id=self.alice.account_id
        )

        output["lp_settlement_cashflow"] = [counterparty_settlement_cashflow] * len(list(output["timestamp"]))
        output["trader_settlement_cashflow"] = [actor_settlement_cashflow] * len(list(output["timestamp"]))

        if not os.path.exists(output_folder):
            os.mkdir(output_folder)

        output.to_csv("{0}/output.csv".format(output_folder), index=False)

        self.generate_output_plots(output=output, output_folder=output_folder)

        return output