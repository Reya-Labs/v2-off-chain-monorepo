from __future__ import absolute_import
import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions
from apache_beam.transforms import PTransform

def run_base_pipeline(pipeline_options: PipelineOptions, readTransform: PTransform, writeTransform: PTransform, transformation: PTransform=None):

    pipeline = beam.Pipeline(options=pipeline_options)

    with pipeline as pipeline:

        data = pipeline | 'Reading' >> readTransform

        if transformation:
            data = data | 'Apply Transformation' >> transformation

        (data | 'Writing' >> writeTransform)

        pipeline.run().wait_until_finish()