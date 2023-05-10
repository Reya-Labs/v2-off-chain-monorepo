import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions
from packages.transformer.src.io import input, output # todo: is this best import pattern?
from apache_beam.transforms import PTransform

def run_pipeline(pipeline_options: PipelineOptions, transformation: PTransform):
    with beam.Pipeline(options=pipeline_options) as p:
        input_data = p | 'Reading' >> input.read()
        transformed_data = input_data | 'Apply Transformation' >> transformation
        output_data = transformed_data | 'Writing' >> output.write()
