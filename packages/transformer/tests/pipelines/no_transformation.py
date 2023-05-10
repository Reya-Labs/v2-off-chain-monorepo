import unittest
import pytest
from apache_beam import Create, io
from apache_beam.testing.util import assert_that
from apache_beam.testing.util import equal_to
from packages.transformer.src.pipelines.no_transformation import run_no_transformation_pipeline
from apache_beam.options.pipeline_options import PipelineOptions
import os
import json


class TestNoTransformationPipeline(unittest.TestCase):

    def setUp(self):
        self.output_file = "output.txt"
        self.pipeline_options = PipelineOptions(["--runner=DirectRunner"])

    @staticmethod
    def load_inputs_ouputs_json():
        with open('mock-data/no_transformation_pipeline.json') as f:
            return json.load(f)

    @pytest.mark.parametrize(
        'mock_data',
        load_inputs_ouputs_json()
    )
    def test_no_transformation_pipeline(self, mock_data):
        mock_input_data = mock_data['input']
        mock_output_data = mock_data['output']
        read_transform = Create(mock_input_data)
        write_transform = io.WriteToText("output.txt")
        output = run_no_transformation_pipeline(self.pipeline_options, read_transform, write_transform)
        assert_that(output, equal_to(mock_output_data))

    def tearDown(self):
        # Delete the output file after the test
        if os.path.exists(self.output_file):
            os.remove(self.output_file)







