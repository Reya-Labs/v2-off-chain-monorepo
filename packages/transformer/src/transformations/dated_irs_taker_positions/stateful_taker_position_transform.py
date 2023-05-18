import apache_beam as beam
from apache_beam.transforms.userstate import BagStateSpec
from apache_beam.coders import BigIntegerCoder, StrUtf8Coder, TimestampCoder
from apache_beam.coders import TupleCoder
from apache_beam.transforms.window import TimestampedValue

class StatefulTakerPositionTransformDoFn(beam.DoFn):

    TAKER_POSITION_STATE = BagStateSpec('taker_position', TupleCoder((StrUtf8Coder, TimestampCoder, BigIntegerCoder)))

    def process(self, initiateTakerOrderEventAndKey: (str, TimestampedValue), cached_taker_position_state=beam.DoFn.StateParam(TAKER_POSITION_STATE)):

        initiateTakerOrderEvent = initiateTakerOrderEventAndKey[1]
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