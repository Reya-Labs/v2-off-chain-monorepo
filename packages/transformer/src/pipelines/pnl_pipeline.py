import apache_beam as beam
from apache_beam.io.iobase import Read, Write
from apache_beam.options.pipeline_options import PipelineOptions
from apache_beam.transforms import PTransform

def run_pipeline(pipeline_options: PipelineOptions, transformation: PTransform, readTransform: Read, writeTransform: Write):
    with beam.Pipeline(options=pipeline_options) as pipeline:
        input_data = pipeline | 'Reading' >> readTransform
        transformed_data = input_data | 'Apply Transformation' >> transformation
        output_data = transformed_data | 'Writing' >> writeTransform
