import apache_beam as beam
from apache_beam.transforms.userstate import BagStateSpec
from apache_beam.coders import BigIntegerCoder, StrUtf8Coder, TimestampCoder
from apache_beam.coders import TupleCoder
from apache_beam.transforms.window import TimestampedValue

class StatefulTakerPositionTransformDoFn(beam.DoFn):

    '''
        todo: clean up these comments
        todo: consider replacing BigIntegerCoder() with the full position schema
        chain_id, instrument_id, market_id, maturity_timestamp, account_id, realized_pnl_from_swaps, realized_pnl_from_fees_paid, net_notional_locked,
        net_fixed_rate_locked, timestamp, rateOracleIndex, cashflow_li_factor, cashflow_time_factor, cashflow_free_term
        need some notion of position_id which is a potentially a hash of chain_id, market_id, instrument_id, maturity_timestamp & account_id

        position_id, timestamp, realized_pnl_from_swaps, realized_pnl_from_fees_paid, net_notional_locked, net_fixed_rate_locked
        rateOracleIndex, cashflow_li_factor, cashflow_time_factor, cashflow_free_term

        to keep things simple start with position_id, timestamp & realized_pnl_from_fees_paid

        need to get this from the initiate taker order event:
        timestamp, accountId, maturityId, maturityTimestamp, executedBaseAmount, executedQuoteAmount, rateOracleIndex, feesPaid

        should be parallelised for each position_id
    '''

    TAKER_POSITION_STATE = BagStateSpec('taker_position', TupleCoder((StrUtf8Coder, TimestampCoder, BigIntegerCoder)))

    def process(self, initiateTakerOrderEvent: TimestampedValue, cached_taker_position_state=beam.DoFn.StateParam(TAKER_POSITION_STATE)):

        fees_paid_to_initiate_taker_order = initiateTakerOrderEvent.value['fees_paid']
        current_taker_order_event_timestamp = initiateTakerOrderEvent.timestamp
        position_id = initiateTakerOrderEvent.value['position_id']

        cached_taker_position_state_list = [x for x in cached_taker_position_state.read()]

        if len(cached_taker_position_state_list)>0:
            position_id = cached_taker_position_state_list[0]
            last_realized_pnl_from_fees_paid = cached_taker_position_state_list[2]
            cached_taker_position_state.clear()
            current_realized_pnl_from_fees_paid = last_realized_pnl_from_fees_paid - fees_paid_to_initiate_taker_order
            cached_taker_position_state.add(position_id, current_taker_order_event_timestamp, current_realized_pnl_from_fees_paid)
        else:
            current_realized_pnl_from_fees_paid = -fees_paid_to_initiate_taker_order

        cached_taker_position_state.add(position_id, current_taker_order_event_timestamp, fees_paid_to_initiate_taker_order)
        yield position_id, current_taker_order_event_timestamp, current_realized_pnl_from_fees_paid