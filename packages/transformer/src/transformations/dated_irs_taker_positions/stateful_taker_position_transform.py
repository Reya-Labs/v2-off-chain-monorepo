import apache_beam as beam
from apache_beam.transforms.userstate import BagStateSpec
from apache_beam.coders import BigIntegerCoder, StrUtf8Coder, TimestampCoder
from apache_beam.coders import TupleCoder
from apache_beam.transforms.window import TimestampedValue
from packages.transformer.src.helpers.get_executed_notional_from_base import get_executed_notional_from_base
from packages.transformer.src.helpers.get_executed_fixed_rate_from_base_quote import get_executed_fixed_rate_from_base_and_quote

class StatefulTakerPositionTransformDoFn(beam.DoFn):

    '''
    - position table schema
        chain_id, instrument_id, market_id, maturity_timestamp, account_id, realized_pnl_from_swaps, realized_pnl_from_fees_paid, net_notional_locked,
        net_fixed_rate_locked, timestamp, rateOracleIndex, cashflow_li_factor, cashflow_time_factor, cashflow_free_term
    - need some notion of position_id which is a potentially a hash of chain_id, market_id, instrument_id, maturity_timestamp & account_id
    - need to get this from the initiate taker order event:
        timestamp, accountId, maturityId, maturityTimestamp, executedBaseAmount, executedQuoteAmount, rateOracleIndex, feesPaid
    - should be parallelised for each position_id
    '''

    # realized_pnl_from_fees_paid, net_notional_locked, net_fixed_rate_locked
    TAKER_POSITION_STATE = BagStateSpec('taker_position', TupleCoder((BigIntegerCoder(), BigIntegerCoder(), BigIntegerCoder())))

    def process(self, initiateTakerOrderEventAndKey: tuple[str, dict], cached_taker_position_state=beam.DoFn.StateParam(TAKER_POSITION_STATE)):

        initiateTakerOrderEvent: dict = initiateTakerOrderEventAndKey[1]
        fees_paid_to_initiate_taker_order: float = initiateTakerOrderEvent['fees_paid']
        executed_base_amount: float = initiateTakerOrderEvent['executed_base_amount']
        executed_quote_amount: float = initiateTakerOrderEvent['executed_quote_amount']
        maturity_timestamp: int = initiateTakerOrderEvent['maturity_timestamp']
        current_rate_oracle_index: float = initiateTakerOrderEvent['rate_oracle_index']
        current_taker_order_event_timestamp: int = initiateTakerOrderEvent['timestamp']
        position_id: str = initiateTakerOrderEvent['position_id']

        cached_taker_position_state_list = [x for x in cached_taker_position_state.read()]

        executed_notional_amount = get_executed_notional_from_base(
            executed_base_amount=executed_base_amount,
            rate_oracle_index_at_execution_timestamp=current_rate_oracle_index
        )

        executed_fixed_rate = get_executed_fixed_rate_from_base_and_quote(
            executed_base_amount=executed_base_amount,
            executed_quote_amount=executed_quote_amount,
            taker_order_timestamp=current_taker_order_event_timestamp,
            maturity_timestamp=maturity_timestamp
        )

        current_realized_pnl_from_fees_paid = -fees_paid_to_initiate_taker_order
        current_net_notional_locked = executed_notional_amount
        current_net_fixed_rate_locked = executed_fixed_rate
        if len(cached_taker_position_state_list)>0:
            last_realized_pnl_from_fees_paid = cached_taker_position_state_list[0]
            last_net_notional_locked = cached_taker_position_state_list[1]
            last_fixed_rate_locked = cached_taker_position_state_list[2]
            cached_taker_position_state.clear()
            current_realized_pnl_from_fees_paid -= last_realized_pnl_from_fees_paid
            current_net_notional_locked += last_net_notional_locked
            current_net_fixed_rate_locked = get_net_fixed_rate_locked(
                executed_fixed_rate=executed_fixed_rate,
                executed_notional_amount=executed_notional_amount,
                last_fixed_rate_locked=last_fixed_rate_locked,
                last_net_notional_locked=last_net_notional_locked
            )
            # todo: executed_base_amount needs to be in turn transformed into the appropriate format
            # this could be done within another do function to keep individual transformations light

        cached_taker_position_state.add((current_realized_pnl_from_fees_paid, current_net_notional_locked, current_net_fixed_rate_locked))
        yield position_id, current_taker_order_event_timestamp, current_realized_pnl_from_fees_paid, current_net_notional_locked