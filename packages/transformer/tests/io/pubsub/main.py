from apache_beam.testing import test_utils
from apache_beam.testing.util import TestWindowedValue
from apache_beam.io.gcp.pubsub import PubsubMessage
from apache_beam.transforms import window
from apache_beam.utils import timestamp
import pytest
from unittest.mock import Mock
from google.cloud.pubsub import SubscriberClient


@pytest.fixture
def mock_pubsub():
    mock_pubsub = Mock(spec=SubscriberClient)
    return mock_pubsub

def test_read_messages_success(mock_pubsub):

    data = b'data'
    publish_time_secs = 1520861821
    publish_time_nanos = 234567000
    attributes = {'key': 'value'}
    ack_id = 'ack_id'
    pull_response = test_utils.create_pull_response([
        test_utils.PullResponseMessage(
            data, attributes, publish_time_secs, publish_time_nanos, ack_id)
    ])

    expected_elements = [
        TestWindowedValue(
            PubsubMessage(data, attributes),
            timestamp.Timestamp(1520861821.234567), [window.GlobalWindow()])
    ]

    mock_pubsub.return_value.pull.return_value = pull_response

