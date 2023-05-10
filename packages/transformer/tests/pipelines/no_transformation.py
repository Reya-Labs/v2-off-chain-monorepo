import unittest
import apache_beam as beam
from apache_beam.testing.test_pipeline import TestPipeline
from apache_beam.testing.util import assert_that
from apache_beam.testing.util import equal_to

class TestNoTransformationPipeline(unittest.TestCase):

    def test_no_transformation_pipeline_transforms(self, mock_data):
        MOCK_INPUT_DATA = mock_data['input']
        EXPECTED_OUTPUT_DATA = mock_data['output']

        with TestPipeline() as testPipeline:
            inputPCollection = testPipeline | beam.Create(MOCK_INPUT_DATA)







