from packages.transformer.src.pipelines.dated_irs_taker_positions.generate_pipeline_and_output import generate_dated_irs_taker_positions_pipeline_and_output
from apache_beam.testing.test_stream import TestStream
from apache_beam.transforms.window import TimestampedValue, GlobalWindow
from apache_beam.options.pipeline_options import StandardOptions
from apache_beam.testing.util import assert_that
from apache_beam.testing.util import equal_to_per_window
from apache_beam.utils.timestamp import Timestamp
from apache_beam.testing.test_pipeline import TestPipeline

def test_run_irs_taker_positions_pipeline():

    # todo: introduce python types for the messages received from pub-sub in io/pubsub

    test_initiate_taker_order_events_stream = (TestStream()
                   .advance_watermark_to(10)
                   .add_elements([TimestampedValue({
                    'position_id': '0xchad',
                    'fees_paid': 10.0,
                    'executed_base_amount': 100.0,
                    'executed_quote_amount': -10.0,
                    'maturity_timestamp': 200,
                    'timestamp': 100, # not sure if we can retrieve the timestamp of timestamp value to avoid duplicate
                    'rate_oracle_index': 1.0
                    }, 100)])
                   .advance_watermark_to_infinity())

    pipeline_options = StandardOptions(streaming=True)
    test_pipeline = TestPipeline(options=pipeline_options)

    dated_irs_taker_positions_pipeline, updated_dated_irs_taker_positions_global_windows = generate_dated_irs_taker_positions_pipeline_and_output(
        dated_irs_taker_position_pipeline=test_pipeline,
        initiate_taker_order_events_stream=test_initiate_taker_order_events_stream
    )

    expected_updated_dated_irs_taker_positions_global_windows = {
        GlobalWindow(): [
            ("0xchad", 100, -10, 100, 0.01, 1.0, 0)
        ],
    }

    assert_that(
        updated_dated_irs_taker_positions_global_windows,
        equal_to_per_window(expected_updated_dated_irs_taker_positions_global_windows),
        label='dated irs taker positions assert')

    dated_irs_taker_positions_pipeline.run()