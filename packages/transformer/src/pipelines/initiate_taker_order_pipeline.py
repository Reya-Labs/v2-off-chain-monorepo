from typing import List
import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions
# TODO: check if the import is done correctly
from packages.transformer.src.io import input, output
from packages.transformer.src.transformations import simple_transformation

# todo: needs restructuring
def run_initiate_taker_order_pipeline(pipeline_options: PipelineOptions, topics: List[str]):
    with beam.Pipeline(options=pipeline_options) as p:
        # Read data from Pub/Sub using input module
        input_data = p | 'Read from Pub/Sub' >> input.read_from_pubsub(topics)


        # Apply transformations
        transformed_data = input_data | 'Apply transformations' >> beam.ParDo(simple_transformation.SimpleTransformation())

        # Write data to Bigtable using output module
        output_data = transformed_data | 'Write to Bigtable' >> output.write_to_bigtable()
