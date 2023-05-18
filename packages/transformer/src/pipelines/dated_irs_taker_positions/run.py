from packages.transformer.src.transformations.dated_irs_taker_positions.stateful_taker_position_transform import StatefulTakerPositionTransformDoFn
import apache_beam as beam
from apache_beam.transforms import trigger

# todo: move to constants
GLOBAL_WINDOW_AFTER_COUNT = 1


# todo: refactor and place into another module
class SetPlaceholderKeyFn(beam.DoFn):
    def process(self, element):
        yield "placeholder_key", element

def run(dated_irs_taker_position_pipeline, initiate_taker_order_events_stream):

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
    dated_irs_taker_position_pipeline.run()

    return initiate_taker_order_events