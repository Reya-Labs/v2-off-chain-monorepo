from typing import List

from apache_beam.testing.test_pipeline import TestPipeline
from apache_beam.testing.test_stream import TestStream
from apache_beam.transforms.window import TimestampedValue
from apache_beam.testing.test_stream import WatermarkEvent
from apache_beam.testing.test_stream import ElementEvent
from apache_beam.testing.test_stream import ProcessingTimeEvent
from apache_beam.utils import timestamp
import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions
from apache_beam.options.pipeline_options import StandardOptions
from apache_beam.testing.util import assert_that
from apache_beam.testing.util import equal_to
from apache_beam.transforms.userstate import BagStateSpec
from apache_beam.coders import BigIntegerCoder
from apache_beam.transforms import trigger
from apache_beam.transforms import window
from apache_beam.testing.util import equal_to_per_window


'''
Stateful Processing

There are two guarantees Cloud Dataflow makes when processing data:
1. all work belonging to the same key will go to the same worker
2. each bundle of work will be processed by exactly one thread

References:
https://github.com/apache/beam/blob/92386d781b5d502c4ea47a0894b72ca57854553d/sdks/python/apache_beam/transforms/userstate.py#L82
https://beam.apache.org/documentation/programming-guide/#single-global-window

A Stateful DoFn by default works on a key and window basis, but since we use global windows, it works per key and lives
within the DoFn instance, which is only created once per worker. 

BagStateSpec is a stateful cell that is created once per key and provides us the ability to store stateful information
for each key. By creating a WALLET_STATE BagStateSpec we can now store a certain state related to each wallet_address

For the current use case, our WALLET_STATE bag will only store at most only one element for each wallet where that
element is the newest state wallet_pnl for the wallet_id. Since the BagStateSpec is created once per key, the number of
bags created in our pipeline = the number of unique wallet addresses, the lifecycle of the Bag is dependent on the
duration of the window in which it exists.

todo: add the ability to also compare the timestamps to check for data order in process calls
'''

class StatefulParDoFn(beam.DoFn):
    CUMULATIVE_WALLET_PNL_STATE = BagStateSpec('wallet', BigIntegerCoder())
    def process(self, element, cumulative_wallet_pnl_state=beam.DoFn.StateParam(CUMULATIVE_WALLET_PNL_STATE)):
        wallet_pnl_since_last_update = element[1] # since 0 is key, is there a way to have a schema instead of using [1]
        cumulative_wallet_pnl_at_last_update_state: List = list(cumulative_wallet_pnl_state.read())
        cumulative_wallet_pnl_updated = wallet_pnl_since_last_update

        if len(cumulative_wallet_pnl_at_last_update_state) > 0:
            cumulative_wallet_pnl_state.clear()
            cumulative_wallet_pnl_updated += cumulative_wallet_pnl_at_last_update_state[-1]

        cumulative_wallet_pnl_state.add((cumulative_wallet_pnl_updated))

        yield cumulative_wallet_pnl_updated

class SetWalletAddressFn(beam.DoFn):
    def process(self, element):
        # 0x is a placeholder wallet address
        yield "0x", element

def test_basic_execution_test_stream():

    START_TIMESTAMP = 10
    LATE_TIMESTAMP = 12
    FINAL_TIMESTAMP = 310
    PNL_DELTA = 10
    GLOBAL_WINDOW_AFTER_COUNT = 1

    test_stream = (TestStream()
                   .advance_watermark_to(START_TIMESTAMP)
                   .add_elements([PNL_DELTA])
                   .advance_watermark_to(START_TIMESTAMP + 10)
                   .add_elements([PNL_DELTA])
                   .advance_processing_time(10)
                   .advance_watermark_to(FINAL_TIMESTAMP - 10)
                   .add_elements([TimestampedValue(PNL_DELTA, LATE_TIMESTAMP)])
                   .add_elements([TimestampedValue(PNL_DELTA, FINAL_TIMESTAMP)])
                   .advance_watermark_to_infinity())

    options = PipelineOptions()
    options.view_as(StandardOptions).streaming = True

    options = StandardOptions(streaming=True)
    test_pipeline = TestPipeline(options=options)

    wallet_pnl_without_keys = test_pipeline | test_stream
    wallet_pnl = wallet_pnl_without_keys | "SetKey" >> beam.ParDo(SetWalletAddressFn())
    wallet_pnl_updated = wallet_pnl | "BagStatefulDoFn" >> beam.ParDo(StatefulParDoFn())

    wallet_pnl_updated = wallet_pnl_updated | beam.WindowInto(
        windowfn=beam.window.GlobalWindows(),
        trigger=trigger.AfterWatermark(early=trigger.AfterCount(GLOBAL_WINDOW_AFTER_COUNT)),
        accumulation_mode=beam.trigger.AccumulationMode.ACCUMULATING,
        allowed_lateness=0
    )

    expected_result = {
        window.GlobalWindow(): [10, 20, 30, 40],
    }

    assert_that(
        wallet_pnl_updated,
        equal_to_per_window(expected_result),
        label='numbers assert per window')

    test_pipeline.run()