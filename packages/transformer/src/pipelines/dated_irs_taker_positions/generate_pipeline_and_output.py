from packages.transformer.src.transformations.dated_irs_taker_positions.stateful_taker_position_transform import StatefulTakerPositionTransformDoFn
import apache_beam as beam
from apache_beam.transforms import trigger
from apache_beam import PTransform, Pipeline
from apache_beam.testing.test_pipeline import TestPipeline
from typing import Union
from packages.transformer.src.io.bigquery.write_to_bigquery import get_write_to_bigquery_transform
from packages.transformer.src.io.bigquery.schemas.dated_irs_taker_positions_schema import get_dated_irs_taker_positions_schema
from apache_beam.io.gcp.internal.clients.bigquery import TableReference
from apache_beam.io import BigQueryDisposition

# todo: move to constants
GLOBAL_WINDOW_AFTER_COUNT = 1

class SetKeyToPositionId(beam.DoFn):
    def process(self, element: dict):
        yield element['position_id'], element

def generate_dated_irs_taker_positions_pipeline_and_output(
        dated_irs_taker_position_pipeline: Union[Pipeline, TestPipeline],
        initiate_taker_order_events_stream: PTransform,
        write_to_bq_table_reference: TableReference=None
        ):
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
    if write_to_bq_table_reference:
        write_to_bq_transform = get_write_to_bigquery_transform(
            table_reference=write_to_bq_table_reference,
            table_schema=get_dated_irs_taker_positions_schema(),
            create_disposition=BigQueryDisposition.CREATE_IF_NEEDED,
            write_disposition=BigQueryDisposition.WRITE_APPEND
        )
        updated_dated_irs_taker_positions_global_windows = updated_dated_irs_taker_positions_global_windows | write_to_bq_transform

    return dated_irs_taker_position_pipeline, updated_dated_irs_taker_positions_global_windows