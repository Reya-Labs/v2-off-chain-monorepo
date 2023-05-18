from packages.transformer.src.transformations.dated_irs_taker_positions.stateful_taker_position_transform import StatefulTakerPositionTransformDoFn
import apache_beam as beam


def run(pipeline_options, initiate_taker_order_events_stream):
    dated_irs_taker_position_pipeline = beam.Pipeline()
    initiate_taker_order_events = dated_irs_taker_position_pipeline | initiate_taker_order_events_stream
    updated_dated_irs_taker_positions = initiate_taker_order_events | "BagStatefulProcessTakerPositions" >> beam.ParDo(StatefulTakerPositionTransformDoFn())


