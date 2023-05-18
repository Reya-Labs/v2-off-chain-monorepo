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
from apache_beam.utils.timestamp import Timestamp
from apache_beam.transforms.window import FixedWindows
from apache_beam.transforms import trigger
from apache_beam.transforms import window
from apache_beam.testing.util import equal_to_per_window

# TODO: Disable frequent lint warning due to pipe operator for chaining transforms
# https://github.com/apache/beam/blob/44b64af0383f5c63d52d6151f24def4630e4f25f/sdks/python/apache_beam/transforms/ptransform_test.py#L68

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


def test_multiple_outputs():
    """Tests that the TestStream supports emitting to multiple PCollections."""

    letters_elements = [
        TimestampedValue('a', 6),
        TimestampedValue('b', 7),
        TimestampedValue('c', 8),
    ]

    numbers_elements = [
        TimestampedValue('1', 11),
        TimestampedValue('2', 12),
        TimestampedValue('3', 13),
    ]

    test_stream = (TestStream()
        .advance_watermark_to(5, tag='letters')
        .add_elements(letters_elements, tag='letters')
        .advance_watermark_to(10, tag='numbers')
        .add_elements(numbers_elements, tag='numbers'))

    options = StandardOptions(streaming=True)
    test_pipeline = TestPipeline(options=options)

    inputCollection = test_pipeline | test_stream

    letters = inputCollection['letters'] | 'record letters' >> beam.ParDo(RecordFn())
    numbers = inputCollection['numbers'] | 'record numbers' >> beam.ParDo(RecordFn())

    assert_that(
        letters,
        equal_to([('a', Timestamp(6)), ('b', Timestamp(7)),
                  ('c', Timestamp(8))]),
        label='assert letters')

    assert_that(
        numbers,
        equal_to([('1', Timestamp(11)), ('2', Timestamp(12)),
                  ('3', Timestamp(13))]),
        label='assert numbers')

    test_pipeline.run()

def test_multiple_outputs_with_watermark_advancements():
    """Tests that the TestStream can independently control output watermarks."""

    # Purposely set the watermark of numbers to 20 then letters to 5 to test
    # that the watermark advancement is per PCollection.
    #
    # This creates two PCollections, (a, b, c) and (1, 2, 3). These will be
    # emitted at different times so that they will have different windows. The
    # watermark advancement is checked by checking their windows. If the
    # watermark does not advance, then the windows will be [-inf, -inf). If the
    # windows do not advance separately, then the PCollections will both
    # windowed in [15, 30).

    letters_elements = [
        TimestampedValue('a', 6),
        TimestampedValue('b', 7),
        TimestampedValue('c', 8),
    ]
    numbers_elements = [
        TimestampedValue('1', 21),
        TimestampedValue('2', 22),
        TimestampedValue('3', 23),
    ]

    test_stream = (TestStream()
                   .advance_watermark_to(0, tag='letters')
                   .advance_watermark_to(0, tag='numbers')
                   .advance_watermark_to(20, tag='numbers')
                   .advance_watermark_to(5, tag='letters')
                   .add_elements(letters_elements, tag='letters')
                   .advance_watermark_to(10, tag='letters')
                   .add_elements(numbers_elements, tag='numbers')
                   .advance_watermark_to(30, tag='numbers'))

    options = StandardOptions(streaming=True)
    test_pipeline = TestPipeline(options=options)

    inputPCollection = test_pipeline | test_stream

    # Use an AfterWatermark trigger with an early firing to test that the
    # watermark is advancing properly and that the element is being emitted in
    # the correct window.

    letters = (
        inputPCollection['letters']
        | 'letter windows' >> beam.WindowInto(
            FixedWindows(15),
            trigger=trigger.AfterWatermark(early=trigger.AfterCount(1)),
            accumulation_mode=trigger.AccumulationMode.DISCARDING)
        | 'letter with key' >> beam.Map(lambda x: ('k', x))
        | 'letter gbk' >> beam.GroupByKey())

    numbers = (
        inputPCollection['numbers']
        | 'number windows' >> beam.WindowInto(
            FixedWindows(15),
            trigger=trigger.AfterWatermark(early=trigger.AfterCount(1)),
            accumulation_mode=trigger.AccumulationMode.DISCARDING)
        | 'number with key' >> beam.Map(lambda x: ('k', x))
        | 'number gbk' >> beam.GroupByKey())

    # The letters were emitted when the watermark was at 5, thus we expect to
    # see the elements in the [0, 15) window. We used an early trigger to make
    # sure that the ON_TIME empty pane was also emitted with a TestStream.
    # This pane has no data because of the early trigger causes the elements to
    # fire before the end of the window and because the accumulation mode
    # discards any data after the trigger fired.
    expected_letters = {
        window.IntervalWindow(0, 15): [
            ('k', ['a', 'b', 'c']),
            ('k', []),
        ],
    }

    # Same here, except the numbers were emitted at watermark = 20, thus they
    # are in the [15, 30) window.
    expected_numbers = {
        window.IntervalWindow(15, 30): [
            ('k', ['1', '2', '3']),
            ('k', []),
        ],
    }

    assert_that(
        letters,
        equal_to_per_window(expected_letters),
        label='letters assert per window')
    assert_that(
        numbers,
        equal_to_per_window(expected_numbers),
        label='numbers assert per window')

    test_pipeline.run()


