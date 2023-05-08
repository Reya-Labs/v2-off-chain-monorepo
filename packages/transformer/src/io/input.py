from typing import List
from apache_beam import PTransform, Flatten
from apache_beam.io import ReadFromPubSub


# todo: needs restructuring
class ReadFromPubSubTopics(PTransform):
    def __init__(self, topics: List[str]):
        self.topics = topics

    def expand(self, pcoll):
        return pcoll | 'Read from multiple Pub/Sub topics' >> Flatten([pcoll | f'Read from {topic}' >> ReadFromPubSub(topic=topic) for topic in self.topics])

def read_from_pubsub(topics: List[str]):
    return ReadFromPubSubTopics(topics)
