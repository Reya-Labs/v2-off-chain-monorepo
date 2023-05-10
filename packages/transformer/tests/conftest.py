import pytest
import json

@pytest.fixture
def test_generic_input_data():
    with open('mock-data/no_transformation_pipeline.json') as f:
        return json.load(f)
