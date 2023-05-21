import argparse
from apache_beam.options.pipeline_options import PipelineOptions
from apache_beam import Pipeline
import logging
from packages.transformer.src.pipelines.dated_irs_taker_positions.generate_pipeline_and_output import generate_dated_irs_taker_positions_pipeline_and_output
from packages.transformer.src.io.bigquery.references.dated_irs_taker_positions_table_reference import get_dated_irs_taker_positions_table_reference
from apache_beam.io.gcp.internal.clients.bigquery import TableReference

def run():
    logging.getLogger().setLevel(logging.INFO)
    parser = argparse.ArgumentParser(description='Run Voltz V2 Apache Beam Pipelines')
    parser.add_argument(
        "--input_pub_sub_topic",
        help="The Cloud Pub/Sub Topic to read from"
    )
    parser.add_argument(
        "--output_big_query_table_id",
        help="The Cloud Big Query Destination Table ID"
    )
    parser.add_argument(
        "--pipeline",
        help="Name of the pipeline"
    )

    args, beam_args = parser.parse_known_args()

    # todo: specify: temp_location='gs://my-bucket/temp'?
    pipeline_options = PipelineOptions(
        runner='DataflowRunner',
        streaming=True,
        save_main_session=True,
        job_name=args.pipeline,
        num_workers=10,
        max_num_workers=10,
        region='eu-west2'
    )

    pipeline_name = beam_args['pipeline']
    input_pub_sub_topic = beam_args['input_pub_sub_topic']
    output_big_query_table_reference: TableReference = get_dated_irs_taker_positions_table_reference(
        table_id=beam_args['output_big_query_table_id']
    )
    pipeline = Pipeline(options=pipeline_options)

    if pipeline_name == "dated_irs_taker_positions":
        dated_irs_taker_position_pipeline, updated_dated_irs_taker_positions_global_windows = generate_dated_irs_taker_positions_pipeline_and_output(
            dated_irs_taker_position_pipeline=pipeline,
            initiate_taker_order_events_stream=input_pub_sub_topic,
            output_big_query_table_reference=output_big_query_table_reference
        )
        dated_irs_taker_position_pipeline.run()


if __name__ == "__main__":
    run()
