import apache_beam as beam
from apache_beam.testing.test_pipeline import TestPipeline
from apache_beam.testing.util import assert_that
from apache_beam.testing.util import equal_to

class AddNDoFn(beam.DoFn):
    def process(self, element, addon):
        return [element + addon]

def test_do_with_do_function():

        with TestPipeline() as pipeline:
            p_collection = pipeline | 'Start' >> beam.Create([1, 2, 3])
            result = p_collection | 'Do' >> beam.ParDo(AddNDoFn(), 10)
            assert_that(result, equal_to([11, 12, 13]))


def test_do_with_callable():
    with TestPipeline() as pipeline:
        pcoll = pipeline | 'Start' >> beam.Create([1, 2, 3])
        result = pcoll | 'Do' >> beam.FlatMap(lambda x, addon: [x + addon], 10)
        assert_that(result, equal_to([11, 12, 13]))

