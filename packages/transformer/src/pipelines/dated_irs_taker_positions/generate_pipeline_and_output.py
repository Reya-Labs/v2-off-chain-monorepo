from packages.transformer.src.transformations.dated_irs_taker_positions.stateful_taker_position_transform import StatefulTakerPositionTransformDoFn
import apache_beam as beam
from apache_beam.transforms import trigger
from apache_beam.transforms.window import TimestampedValue

# todo: move to constants
GLOBAL_WINDOW_AFTER_COUNT = 1

class SetKeyToPositionId(beam.DoFn):
    def process(self, element: dict):
        yield element['position_id'], element

def generate_dated_irs_taker_positions_pipeline_and_output(dated_irs_taker_position_pipeline, initiate_taker_order_events_stream):
    '''
    consider using this windowing approach (need to confirm what AfterProcessingTime means)
    beam.WindowInto(GlobalWindows(), trigger=trigger.AfterAll(trigger.AfterCount(1), trigger.AfterProcessingTime(1)))
    '''

    initiate_taker_order_events = dated_irs_taker_position_pipeline | initiate_taker_order_events_stream
    initiate_taker_order_events_with_keys = initiate_taker_order_events | "SetKey" >> beam.ParDo(SetKeyToPositionId())
    updated_dated_irs_taker_positions = initiate_taker_order_events_with_keys | "BagStatefulProcessTakerPositions" >> beam.ParDo(StatefulTakerPositionTransformDoFn())
    updated_dated_irs_taker_positions_global_windows = updated_dated_irs_taker_positions | beam.WindowInto(
        windowfn=beam.window.GlobalWindows(),
        trigger=trigger.AfterWatermark(early=trigger.AfterCount(GLOBAL_WINDOW_AFTER_COUNT)),
        accumulation_mode=beam.trigger.AccumulationMode.ACCUMULATING,
        allowed_lateness=0
    )

    return dated_irs_taker_position_pipeline, updated_dated_irs_taker_positions_global_windows