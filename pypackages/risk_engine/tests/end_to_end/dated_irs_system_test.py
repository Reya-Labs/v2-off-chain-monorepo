import unittest

from risk_engine.src.constants import DAY_IN_SECONDS, MONTH_IN_SECONDS
from risk_engine.src.contracts.core import AccountManager
from risk_engine.src.contracts.core.collateralModule import CollateralModule
from risk_engine.src.contracts.core.feeManager import FeeManager
from risk_engine.src.contracts.core.liquidationModule import LiquidationModule
from risk_engine.src.evm.block import Block
from risk_engine.src.contracts.exchanges.vamm.datedIRSVAMMExchange import DatedIRSVAMMExchange
from risk_engine.src.contracts.instruments.dated_irs.datedIRSMarket import DatedIRSMarket
from risk_engine.src.contracts.instruments.dated_irs import MarketManager
from risk_engine.src.contracts.oracles import Oracle
from risk_engine.tests.end_to_end.helpers import get_rate_given_apy

"""
This end-to-end test has the following assumptions and series of actions:
    - There's one market and one pool on top of USDC interest rates
    - The market supports only one maturity, of 30 days

    - The pool starts at 5% and the variable APY is around 6-6.2%
      during the pool duration

    - This test assumes NO slippage in the GWAP calculation

    - There are two actors, Alice (maker) and Bob(taker)
    - Alice mints liquidity in the pool at the beginning of the pool
    - Bob trades during the market duration

    - The test checks the account orders, PnL and margin requirements
      at different points in time

    - Once the pool matures, Alice and Bob settle their positions
"""


class Test(unittest.TestCase):
    def get_observations(self, relative_timestamp):
        t_0 = 0
        rate_0 = 1.1

        t_10 = 10 * DAY_IN_SECONDS
        rate_10 = get_rate_given_apy(
            rate_start=rate_0, time=10 / 365, apy_in_between=0.06
        )

        t_20 = 20 * DAY_IN_SECONDS
        rate_20 = get_rate_given_apy(
            rate_start=rate_10, time=10 / 365, apy_in_between=0.06
        )

        t_30 = 30 * DAY_IN_SECONDS
        rate_30 = get_rate_given_apy(
            rate_start=rate_20, time=10 / 365, apy_in_between=0.06
        )

        return [
            [relative_timestamp, rate_0],
            [t_10 - t_0 + relative_timestamp, rate_10],
            [t_20 - t_0 + relative_timestamp, rate_20],
            [t_30 - t_0 + relative_timestamp, rate_30],
        ]

    def setUp(self):
        self.block = Block(relative_block_position=0)
        self.observations = self.get_observations(
            relative_timestamp=self.block.timestamp
        )
        self.oracle = Oracle(
            block=self.block, initial_observations=[self.observations[0]]
        )
        self.current_observation_index = 0
        self.account_manager = AccountManager()
        self.fee_manager = FeeManager()
        self.collateral_module = CollateralModule()
        self.liquidation_module = LiquidationModule(
            im_multiplier=1.5, liquidator_reward_proportion_of_im_delta=0.05
        )
        self.market_manager = MarketManager()

        # Set up the account manager
        self.account_manager.set_market_manager(market_manager=self.market_manager)

        # Set up the fee manager
        self.fee_manager.set_fee_collector_account_id_of_protocol(
            fee_collector_protocol="protocol"
        )

        self.fee_manager.set_atomic_maker_taker_fees(
            market_id="market_irs_usdc",
            # 0.5% maker fees
            new_atomic_maker_fee=0.005,
            # 1% taker fees
            new_atomic_taker_fee=0.01,
        )

        self.liquidation_module.set_im_multiplier(im_multiplier=1.5)

        # Set up IRS USDC market
        self.market_irs_usdc: DatedIRSMarket = DatedIRSMarket(
            block=self.block, market_id="market_irs_usdc"
        )

        self.market_irs_usdc.set_collateral_module(
            collateral_module=self.collateral_module
        )
        self.market_irs_usdc.set_liquidation_module(
            liquidation_module=self.liquidation_module
        )
        self.market_irs_usdc.set_oracle(oracle=self.oracle)
        self.market_irs_usdc.set_account_manager(account_manager=self.account_manager)
        self.market_irs_usdc.set_fee_manager(fee_manager=self.fee_manager)

        # Set up IRS USDC pool

        self.pool_irs_usdc_maturity = self.block.timestamp + MONTH_IN_SECONDS

        self.pool_irs_usdc = DatedIRSVAMMExchange(
            pool_id="pool_irs_usdc",
            block=self.block,
            min_tick=0,
            max_tick=100000,
            tick_spacing=10,
            term_end_in_seconds=self.pool_irs_usdc_maturity,
            oracle=self.oracle,
        )

        self.pool_irs_usdc.initialize(current_tick=5000)

        self.market_irs_usdc.register_pool(pool=self.pool_irs_usdc)

        # Set up market manager
        self.market_manager.register_market(market=self.market_irs_usdc)

        # Set up account
        self.alice = self.account_manager.create_account(
            account_id="alice", base_token="USDC"
        )

        self.bob = self.account_manager.create_account(
            account_id="bob", base_token="USDC"
        )

        # Set up risk mapping
        self.liquidation_module.set_risk_mapping(
            risk_mapping={"market_irs_usdc": {self.pool_irs_usdc_maturity: 2}}
        )

    def advance_to_next_observation(self):
        if self.current_observation_index + 1 == len(self.observations):
            raise Exception("test: no more observations to advance")

        time_to_move_forward = (
            self.observations[self.current_observation_index + 1][0]
            - self.observations[self.current_observation_index][0]
        )

        # System: Advance time
        self.block.skip_forward_time(time_to_move_forward=time_to_move_forward)

        # System: Set new rate
        self.oracle.capture_rate(
            rate=self.observations[self.current_observation_index + 1][1]
        )

        self.current_observation_index += 1

    def test(self):

        # Alice: Deposit USDC margin
        self.collateral_module.deposit_collateral(
            account_id=self.alice.account_id, amount=200
        )

        # Alice: Mint between [3%, 7%] on IRS USDC market

        self.market_irs_usdc.process_limit_order(
            pool_id="pool_irs_usdc",
            maturity=self.pool_irs_usdc_maturity,
            account_id="alice",
            base=1000,
            lower_price=0.03,
            upper_price=0.07,
        )

        # Alice: Check fees paid
        balance = self.collateral_module.get_account_collateral_balance(
            account_id="alice"
        )
        self.assertAlmostEqual(balance, 200 - 0.452054794520548)

        # Alice: Check orders
        bases = self.alice.get_annualized_filled_and_unfilled_orders()
        self.assertAlmostEqual(
            bases[0]["unfilled_long"], 500 * 30 / 365 * self.observations[0][1]
        )
        self.assertAlmostEqual(
            bases[0]["unfilled_short"], -500 * 30 / 365 * self.observations[0][1]
        )
        self.assertAlmostEqual(bases[0]["filled"], 0)

        # Alice: Check unrealized PnL
        unrealized_pnl = self.alice.get_account_unrealized_pnl()
        self.assertAlmostEqual(unrealized_pnl, 0)

        # Alice: Check margin requirements
        margin_requirements = self.liquidation_module.get_account_margin_requirements(
            account_id="alice", account_manager=self.account_manager
        )

        self.assertAlmostEqual(margin_requirements[0], 135.6164383561644)
        self.assertAlmostEqual(margin_requirements[1], 90.41095890410959)

        # System: Advance 10 days
        self.advance_to_next_observation()

        # Bob: Deposit USDC margin
        self.collateral_module.deposit_collateral(
            account_id=self.bob.account_id, amount=200
        )

        # Bob: Trade
        self.market_irs_usdc.process_market_order(
            pool_id="pool_irs_usdc",
            maturity=self.pool_irs_usdc_maturity,
            account_id="bob",
            base=200,
        )

        # Bob: Check fees paid
        balance = self.collateral_module.get_account_collateral_balance(
            account_id="bob"
        )
        self.assertAlmostEqual(balance, 200 - 0.120740542)

        # Bob: Check orders
        bases = self.bob.get_annualized_filled_and_unfilled_orders()
        self.assertAlmostEqual(bases[0]["unfilled_long"], 0)
        self.assertAlmostEqual(bases[0]["unfilled_short"], 0)
        self.assertAlmostEqual(
            bases[0]["filled"], 200 * 20 / 365 * self.observations[1][1]
        )

        # System: Check GWAP
        gwap = self.market_irs_usdc.aggregate_gwap(maturity=self.pool_irs_usdc_maturity)
        self.assertAlmostEqual(gwap, 0.058)

        # Bob: Check unrealized PnL
        unrealized_pnl = self.bob.get_account_unrealized_pnl()
        self.assertAlmostEqual(
            unrealized_pnl, 200 * self.observations[1][1] * 0.004 * 20 / 365
        )

        # Bob: Check margin requirement
        margin_requirements = self.liquidation_module.get_account_margin_requirements(
            account_id="bob", account_manager=self.account_manager
        )

        self.assertAlmostEqual(margin_requirements[0], 36.22216279621038)
        self.assertAlmostEqual(margin_requirements[1], 24.14810853080692)

        # System: Advance 10 days
        self.advance_to_next_observation()

        # Alice: Check orders
        bases = self.alice.get_annualized_filled_and_unfilled_orders()
        self.assertAlmostEqual(
            bases[0]["unfilled_long"], 700 * 10 / 365 * self.observations[2][1]
        )
        self.assertAlmostEqual(
            bases[0]["unfilled_short"], -300 * 10 / 365 * self.observations[2][1]
        )
        self.assertAlmostEqual(
            bases[0]["filled"], -200 * 10 / 365 * self.observations[2][1]
        )

        # Alice: Check unrealized PnL
        unrealized_pnl = self.alice.get_account_unrealized_pnl()
        self.assertAlmostEqual(unrealized_pnl, -0.05075998221735745)

        # Alice: Check margin requirements
        margin_requirements = self.liquidation_module.get_account_margin_requirements(
            account_id="alice", account_manager=self.account_manager
        )

        self.assertAlmostEqual(margin_requirements[0], 45.35004292962463)
        self.assertAlmostEqual(margin_requirements[1], 30.233361953083087)

        # Bob: Check orders
        bases = self.bob.get_annualized_filled_and_unfilled_orders()
        self.assertAlmostEqual(bases[0]["unfilled_long"], 0)
        self.assertAlmostEqual(bases[0]["unfilled_short"], 0)
        self.assertAlmostEqual(
            bases[0]["filled"], 200 * 10 / 365 * self.observations[2][1]
        )

        # Bob: Check unrealized PnL
        unrealized_pnl = self.bob.get_account_unrealized_pnl()
        self.assertAlmostEqual(unrealized_pnl, 0.05075998221735745)

        # Bob: Check margin requirement
        margin_requirements = self.liquidation_module.get_account_margin_requirements(
            account_id="bob", account_manager=self.account_manager
        )

        self.assertAlmostEqual(margin_requirements[0], 18.140017171849852)
        self.assertAlmostEqual(margin_requirements[1], 12.093344781233235)

        # System: Advance 10 days
        self.advance_to_next_observation()

        # Alice: Settle
        self.market_irs_usdc.settle(
            maturity=self.pool_irs_usdc_maturity, account_id="alice"
        )

        # Bob: Settle
        self.market_irs_usdc.settle(
            maturity=self.pool_irs_usdc_maturity, account_id="bob"
        )

        # Alice: Check orders
        bases = self.alice.get_annualized_filled_and_unfilled_orders()
        self.assertAlmostEqual(bases[0]["unfilled_long"], 0)
        self.assertAlmostEqual(bases[0]["unfilled_short"], 0)
        self.assertAlmostEqual(bases[0]["filled"], 0)

        # Alice: Check unrealized PnL
        unrealized_pnl = self.alice.get_account_unrealized_pnl()
        self.assertAlmostEqual(unrealized_pnl, 0)

        # Bob: Check orders
        bases = self.bob.get_annualized_filled_and_unfilled_orders()
        self.assertAlmostEqual(bases[0]["unfilled_long"], 0)
        self.assertAlmostEqual(bases[0]["unfilled_short"], 0)
        self.assertAlmostEqual(bases[0]["filled"], 0)

        # Bob: Check unrealized PnL
        unrealized_pnl = self.bob.get_account_unrealized_pnl()
        self.assertAlmostEqual(unrealized_pnl, 0)

        # Alice: Check settlement cashflow
        balance = self.collateral_module.get_account_collateral_balance(
            account_id="alice"
        )
        self.assertAlmostEqual(balance, 200 - 0.452054794520548 - 0.052667364946756834)

        # Bob: Check settlement cashflow
        balance = self.collateral_module.get_account_collateral_balance(
            account_id="bob"
        )
        self.assertAlmostEqual(balance, 200 - 0.120740542 + 0.052667364946756834)


if __name__ == "__main__":
    unittest.main()
