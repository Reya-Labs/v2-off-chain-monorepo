import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions
from packages.transformer.src.io import input, output # todo: is this best import pattern?


def run_pipeline(pipeline_options: PipelineOptions, transformation: ):
    with beam.Pipeline(options=pipeline_options) as p:
        input_data = p | 'Read from Pub/Sub' >> input.read()
        transformed_data = input_data | 'Apply PnL Transformation' >> beam.ParDo(pnl_transformation.PnLTransformation())
        output_data = transformed_data | 'Write to Bigtable' >> output.write_to_bigtable()
