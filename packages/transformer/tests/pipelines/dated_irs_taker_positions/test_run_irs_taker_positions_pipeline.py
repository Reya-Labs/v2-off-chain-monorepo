from packages.transformer.src.pipelines.dated_irs_taker_positions.run import run as run_irs_taker_positions_pipeline
from apache_beam.testing.test_stream import TestStream
from apache_beam.transforms.window import TimestampedValue, GlobalWindow
from apache_beam.options.pipeline_options import StandardOptions
from apache_beam.testing.util import assert_that
from apache_beam.testing.util import equal_to_per_window

def test_run_irs_taker_positions_pipeline():

    # todo: introduce python types for the messages received from pub-sub in io/pubsub

    test_initiate_taker_order_events_stream = (TestStream()
                   .advance_watermark_to(10)
                   .add_elements([TimestampedValue({
                    'position_id': '0xchad',
                    'fees_paid': 10,
                    'executed_base_amount': 100,
                    'executed_quote_amount': -10
                    }, 100)])
                   .advance_watermark_to_infinity())

    pipeline_options = StandardOptions(streaming=True)

    updated_dated_irs_taker_positions_global_windows = run_irs_taker_positions_pipeline(
        pipeline_options=pipeline_options,
        initiate_taker_order_events_stream=test_initiate_taker_order_events_stream
    )

    expected_updated_dated_irs_taker_positions_global_windows = {
        GlobalWindow(): [10, 20, 30, 40],
    }

    assert_that(
        updated_dated_irs_taker_positions_global_windows,
        equal_to_per_window(expected_updated_dated_irs_taker_positions_global_windows),
        label='dated irs taker positions assert')