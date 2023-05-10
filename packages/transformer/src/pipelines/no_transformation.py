from base_pipeline import run_pipeline
from apache_beam.transforms import PTransform
from apache_beam.options.pipeline_options import PipelineOptions

def run_no_transformation_pipeline(pipeline_options: PipelineOptions, readTransform: PTransform, writeTransform: PTransform):
    run_pipeline(pipeline_options, readTransform, writeTransform)
