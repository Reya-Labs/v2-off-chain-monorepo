import apache_beam as beam
from apache_beam.transforms.userstate import BagStateSpec
from apache_beam.coders import FloatCoder, TupleCoder, BigIntegerCoder
from packages.transformer.src.helpers.get_executed_notional_from_base import get_executed_notional_from_base
from packages.transformer.src.helpers.get_executed_fixed_rate_from_base_quote import get_executed_fixed_rate_from_base_and_quote
from packages.transformer.src.helpers.get_net_fixed_rate_locked import get_net_fixed_rate_locked
from packages.transformer.src.helpers.get_realized_pnl_from_swaps_since_last_update import get_realized_pnl_from_swaps_since_last_update
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

    # realized_pnl_from_fees_paid, net_notional_locked, net_fixed_rate_locked, base_balance, rate_oracle_index, realized_pnl, timestamp
    TAKER_POSITION_STATE = BagStateSpec('taker_position', TupleCoder((BigIntegerCoder(), FloatCoder(), FloatCoder(), FloatCoder(), FloatCoder(), FloatCoder())))

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

        updated_realized_pnl_from_fees_paid = -fees_paid_to_initiate_taker_order
        updated_net_notional_locked = executed_notional_amount
        updated_net_fixed_rate_locked = executed_fixed_rate
        updated_base_balance = executed_base_amount
        updated_realized_pnl_from_swaps = 0
        if len(cached_taker_position_state_list)>0:
            last_timestamp = cached_taker_position_state_list[0]
            last_realized_pnl_from_fees_paid = cached_taker_position_state_list[1]
            last_net_notional_locked = cached_taker_position_state_list[2]
            last_fixed_rate_locked = cached_taker_position_state_list[3]
            last_base_balance = cached_taker_position_state_list[4]
            last_rate_oracle_index = cached_taker_position_state_list[5]
            last_realized_pnl = cached_taker_position_state_list[6]
            cached_taker_position_state.clear()
            updated_realized_pnl_from_fees_paid -= last_realized_pnl_from_fees_paid
            updated_net_notional_locked += last_net_notional_locked
            updated_net_fixed_rate_locked = get_net_fixed_rate_locked(
                executed_fixed_rate=executed_fixed_rate,
                executed_notional_amount=executed_notional_amount,
                last_fixed_rate_locked=last_fixed_rate_locked,
                last_net_notional_locked=last_net_notional_locked
            )
            updated_base_balance += last_base_balance
            updated_realized_pnl_from_swaps = last_realized_pnl + get_realized_pnl_from_swaps_since_last_update(
                base_balance=last_base_balance,
                last_rate_oracle_index=last_rate_oracle_index,
                current_rate_oracle_index=current_rate_oracle_index,
                last_timestamp=last_timestamp,
                current_timestamp=current_taker_order_event_timestamp
            )

            # todo: executed_base_amount needs to be in turn transformed into the appropriate format
            # this could be done within another do function to keep individual transformations light

        cached_taker_position_state.add((current_taker_order_event_timestamp, updated_realized_pnl_from_fees_paid, updated_net_notional_locked, updated_net_fixed_rate_locked,
                                         current_rate_oracle_index, updated_realized_pnl_from_swaps))
        yield position_id, current_taker_order_event_timestamp, updated_realized_pnl_from_fees_paid, updated_net_notional_locked, updated_net_fixed_rate_locked, current_rate_oracle_index, updated_realized_pnl_from_swaps