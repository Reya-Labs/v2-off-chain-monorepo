import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions
from apache_beam.transforms import PTransform

def run_pipeline(pipeline_options: PipelineOptions, transformation: PTransform, input: PTransform, output: PTransform):
    with beam.Pipeline(options=pipeline_options) as p:
        input_data = p | 'Reading' >> input.read()
        transformed_data = input_data | 'Apply Transformation' >> transformation
        output_data = transformed_data | 'Writing' >> output.write()
