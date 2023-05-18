from packages.transformer.src.pipelines.dated_irs_taker_positions.run import run as run_irs_taker_positions_pipeline
from apache_beam.testing.test_stream import TestStream
from apache_beam.transforms.window import TimestampedValue
from apache_beam.options.pipeline_options import StandardOptions

def test_run():

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

    run_irs_taker_positions_pipeline(
        pipeline_options=pipeline_options,
        initiate_taker_order_events_stream=test_initiate_taker_order_events_stream
    )

    # do assertions here