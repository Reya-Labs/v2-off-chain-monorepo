import pytest
import json

@pytest.fixture
def no_transformation_pipeline_mock_data():
    with open('mock-data/no_transformation_pipeline.json') as f:
        return json.load(f)
