import pytest
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


# todo: have some sort of module for mocks and test supporting utils like this one
class RecordFn(beam.DoFn):
    def process(
            self,
            element=beam.DoFn.ElementParam,
            timestamp=beam.DoFn.TimestampParam):
        yield (element, timestamp)



def test_basic_execution_test_stream():
    test_stream = (TestStream()
                   .advance_watermark_to(10)
                   .add_elements(['a', 'b', 'c'])
                   .advance_watermark_to(20)
                   .add_elements(['d', 'e'])
                   .advance_processing_time(10)
                   .advance_watermark_to(300)
                   .add_elements([TimestampedValue('late', 12)])
                   .add_elements([TimestampedValue('last', 310)])
                   .advance_watermark_to_infinity())



    options = PipelineOptions()
    options.view_as(StandardOptions).streaming = True

    with TestPipeline(options=options) as test_pipeline:

        assert test_stream._events == [
            WatermarkEvent(10),
            ElementEvent([TimestampedValue('a', 10), TimestampedValue('b', 10), TimestampedValue('c', 10), ]),
            WatermarkEvent(20),
            ElementEvent([TimestampedValue('d', 20), TimestampedValue('e', 20 )]),
            ProcessingTimeEvent(10),
            WatermarkEvent(300),
            ElementEvent([
                TimestampedValue('late', 12),
            ]),
            ElementEvent([
                TimestampedValue('last', 310),
            ]),
            WatermarkEvent(timestamp.MAX_TIMESTAMP),
        ]

        my_record_fn = RecordFn()
        records = test_pipeline | test_stream
        records = records | beam.ParDo(my_record_fn)

        assert_that(
            records,
            equal_to([
                ('a', timestamp.Timestamp(10)),
                ('b', timestamp.Timestamp(10)),
                ('c', timestamp.Timestamp(10)),
                ('d', timestamp.Timestamp(20)),
                ('e', timestamp.Timestamp(20)),
                ('late', timestamp.Timestamp(12)),
                ('last', timestamp.Timestamp(310)),
            ]))