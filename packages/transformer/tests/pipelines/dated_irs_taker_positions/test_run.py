from packages.transformer.src.pipelines.dated_irs_taker_positions.run import run
from apache_beam.testing.test_stream import TestStream
from apache_beam.transforms.window import TimestampedValue

def test_run():

    # todo: introduce python types for the messages received from pub-sub
    # needs to be done within the io

    test_initiate_taker_order_events_stream = (TestStream()
                   .advance_watermark_to(10)
                   .add_elements([TimestampedValue('last', 310)])
                   .advance_watermark_to_infinity())

    pass