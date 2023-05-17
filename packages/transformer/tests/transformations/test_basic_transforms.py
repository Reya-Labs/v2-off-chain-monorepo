import apache_beam as beam
from apache_beam.testing.test_pipeline import TestPipeline
from apache_beam.testing.util import assert_that
from apache_beam.testing.util import equal_to
from apache_beam import pvalue
import pytest
from apache_beam import typehints
from apache_beam.options.pipeline_options import TypeOptions

class AddNDoFn(beam.DoFn):
    def process(self, element, addon):
        return [element + addon]


class SomeDoFn(beam.DoFn):
    """A custom DoFn using yield."""

    def process(self, element):
        yield element
        if element % 2 == 0:
            yield pvalue.TaggedOutput('even', element)
        else:
            yield pvalue.TaggedOutput('odd', element)




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



def test_do_with_side_input_as_arg():
    with TestPipeline() as pipeline:
      side = pipeline | 'Side' >> beam.Create([10])
      pcoll = pipeline | 'Start' >> beam.Create([1, 2, 3])
      result = pcoll | 'Do' >> beam.FlatMap(
          lambda x, addon: [x + addon], pvalue.AsSingleton(side))
      assert_that(result, equal_to([11, 12, 13]))


@pytest.mark.it_validatesrunner
def test_par_do_with_multiple_outputs_and_using_yield():
    with TestPipeline() as pipeline:
        nums = pipeline | 'Some Numbers' >> beam.Create([1, 2, 3, 4])
        results = nums | 'ClassifyNumbers' >> beam.ParDo(SomeDoFn()).with_outputs('odd', 'even', main='main')
        assert_that(results.main, equal_to([1, 2, 3, 4]))
        assert_that(results.odd, equal_to([1, 3]), label='assert:odd')
        assert_that(results.even, equal_to([2, 4]), label='assert:even')


def test_do_requires_do_fn_returning_iterable():
    # This function is incorrect because it returns an object that isn't an
    # iterable.
    def incorrect_par_do_fn(x):
      return x + 5

    with pytest.raises(typehints.TypeCheckError) as cm:
        with TestPipeline() as pipeline:
            pipeline._options.view_as(TypeOptions).runtime_type_check = True
            pcoll = pipeline | 'Start' >> beam.Create([2, 9, 3])
            pcoll | 'Do' >> beam.FlatMap(incorrect_par_do_fn)
            # It's a requirement that all user-defined functions to a ParDo return
            # an iterable.