from base_pipeline import run_pipeline
from apache_beam.io.iobase import Read, Write
from apache_beam.options.pipeline_options import PipelineOptions

def run_no_transformation_pipeline(pipeline_options: PipelineOptions, readTransform: Read, writeTransform: Write):
    # Run the pipeline without a transformation
    run_pipeline(pipeline_options, readTransform, writeTransform)
