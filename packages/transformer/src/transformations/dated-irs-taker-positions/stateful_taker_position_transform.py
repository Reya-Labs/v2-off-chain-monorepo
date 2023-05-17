import apache_beam as beam
from apache_beam.transforms.userstate import BagStateSpec
from apache_beam.coders import BigIntegerCoder, StrUtf8Coder, TimestampCoder
from apache_beam.coders import TupleCoder

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
    '''


    TAKER_POSITION_STATE = BagStateSpec('taker_position', TupleCoder((StrUtf8Coder, TimestampCoder, BigIntegerCoder)))
    def process(self, event, cached_taker_position_state=beam.DoFn.StateParam(TAKER_POSITION_STATE)):

        pass



