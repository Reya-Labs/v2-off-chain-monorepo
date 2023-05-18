from packages.transformer.src.transformations.dated_irs_taker_positions.stateful_taker_position_transform import StatefulTakerPositionTransformDoFn
import apache_beam as beam
from apache_beam.transforms import trigger
from apache_beam.transforms.window import TimestampedValue

# todo: move to constants
GLOBAL_WINDOW_AFTER_COUNT = 1


# todo: refactor and make sure position_id is used as the key and place into another module
class SetPlaceholderKeyFn(beam.DoFn):
    def process(self, element: TimestampedValue):
        yield "placeholder_key", element

def generate_dated_irs_taker_positions_pipeline_and_output(dated_irs_taker_position_pipeline, initiate_taker_order_events_stream):

    # todo: make sure stateful transforms are done by key

    initiate_taker_order_events = dated_irs_taker_position_pipeline | initiate_taker_order_events_stream
    initiate_taker_order_events_with_keys = initiate_taker_order_events | "SetKey" >> beam.ParDo(SetPlaceholderKeyFn())
    updated_dated_irs_taker_positions = initiate_taker_order_events_with_keys | "BagStatefulProcessTakerPositions" >> beam.ParDo(StatefulTakerPositionTransformDoFn())
    updated_dated_irs_taker_positions_global_windows = updated_dated_irs_taker_positions | beam.WindowInto(
        windowfn=beam.window.GlobalWindows(),
        trigger=trigger.AfterWatermark(early=trigger.AfterCount(GLOBAL_WINDOW_AFTER_COUNT)),
        accumulation_mode=beam.trigger.AccumulationMode.ACCUMULATING,
        allowed_lateness=0
    )

    return dated_irs_taker_position_pipeline, updated_dated_irs_taker_positions_global_windows