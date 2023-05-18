from packages.transformer.src.transformations.dated_irs_taker_positions.stateful_taker_position_transform import StatefulTakerPositionTransformDoFn
import apache_beam as beam
from apache_beam.transforms import trigger

# todo: move to constants
GLOBAL_WINDOW_AFTER_COUNT = 1

def run(pipeline_options, initiate_taker_order_events_stream):
    dated_irs_taker_position_pipeline = beam.Pipeline(pipeline_options)
    initiate_taker_order_events = dated_irs_taker_position_pipeline | initiate_taker_order_events_stream
    updated_dated_irs_taker_positions = initiate_taker_order_events | "BagStatefulProcessTakerPositions" >> beam.ParDo(StatefulTakerPositionTransformDoFn())
    updated_dated_irs_taker_positions_global_windows = updated_dated_irs_taker_positions | beam.WindowInto(
        windowfn=beam.window.GlobalWindows(),
        trigger=trigger.AfterWatermark(early=trigger.AfterCount(GLOBAL_WINDOW_AFTER_COUNT)),
        accumulation_mode=beam.trigger.AccumulationMode.ACCUMULATING,
        allowed_lateness=0
    )
    dated_irs_taker_position_pipeline.run()