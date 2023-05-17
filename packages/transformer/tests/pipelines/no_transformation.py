import pytest
from apache_beam import Create, io
from apache_beam.testing.util import assert_that, equal_to
from packages.transformer.src.pipelines.no_transformation import run_no_transformation_pipeline
from apache_beam.options.pipeline_options import PipelineOptions
import os
import json


# todo: move to a separate place & consider simplifying relative imports
def load_inputs_outputs_json():
    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.realpath(__file__))
    # Move up one level in the directory structure
    parent_dir = os.path.dirname(script_dir)
    # Construct a path to the JSON file, relative to the parent directory
    json_path = os.path.join(parent_dir, 'mock-data', 'no_transformation_pipeline.json')

    with open(json_path) as f:
        return json.load(f)


@pytest.fixture(scope='function')
def pipeline_options():
    return PipelineOptions(["--runner=DirectRunner"])


@pytest.fixture(scope='function')
def output_file():
    yield "output.txt"
    # Delete the output file after the test
    if os.path.exists("output.txt"):
        os.remove("output.txt")


@pytest.mark.parametrize('mock_input_data, mock_output_data', load_inputs_outputs_json())
def test_no_transformation_pipeline(pipeline_options, mock_input_data, mock_output_data, output_file):
    print(mock_input_data)
    print(mock_output_data)
    read_transform = Create(mock_input_data)
    write_transform = io.WriteToText(output_file)
    output = run_no_transformation_pipeline(pipeline_options, read_transform, write_transform)
    assert_that(output, equal_to(mock_output_data))
