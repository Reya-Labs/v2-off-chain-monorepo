from apache_beam.io import ReadFromPubSub
from apache_beam import PTransform

def get_read_pubsub_events_transform(topic_name: str) -> PTransform:
    '''
    A PTransform for reading from Cloud Pub/Sub
    :param topic_name: Cloud Pub/Sub topic in the form “projects/<project>/topics/<topic>”
    :return:
    '''
    return ReadFromPubSub(topic=topic_name, with_attributes=True, timestamp_attribute='event_timestamp')
    # return ReadFromPubSub(topic=topic_name, with_attributes=True, timestamp_attribute='timestamp', id_label='event_id')