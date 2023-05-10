import unittest
import pytest
import apache_beam as beam
from apache_beam.testing.test_pipeline import TestPipeline
from apache_beam.testing.util import assert_that
from apache_beam.testing.util import equal_to
from packages.transformer.tests.conftest import no_transformation_pipeline_mock_data
from packages.transformer.src.pipelines.no_transformation import run_no_transformation_pipeline
from apache_beam.options.pipeline_options import PipelineOptions


@pytest.mark.parametrize("test_case", no_transformation_pipeline_mock_data())
class TestNoTransformationPipeline(unittest.TestCase):

    def test_no_transformation_pipeline_transforms(self, mock_data):
        mock_input_data = mock_data['input']
        mock_output_data = mock_data['output']

        # Define the pipeline options and transforms
        pipeline_options = PipelineOptions(["--runner=DirectRunner"])
        read_transform = beam.Create(mock_input_data)
        write_transform = beam.io.WriteToText("output.txt")

        run_no_transformation_pipeline(pipeline_options, read_transform, write_transform)







