import argparse
from apache_beam.options.pipeline_options import PipelineOptions
from apache_beam import Pipeline
import logging
from packages.transformer.src.pipelines.dated_irs_taker_positions.generate_pipeline_and_output import generate_dated_irs_taker_positions_pipeline_and_output

def run():
    logging.getLogger().setLevel(logging.INFO)
    parser = argparse.ArgumentParser(description='Run Voltz V2 Apache Beam Pipelines')
    parser.add_argument(
        "--pub_sub_topic_input",
        help="The Cloud Pub/Sub Topic to read from"
    )
    parser.add_argument(
        "--big_query_table_id_output",
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
    input_stream = beam_args['input']
    pipeline = Pipeline(options=pipeline_options)

    if pipeline_name == "dated_irs_taker_positions":
        dated_irs_taker_position_pipeline, updated_dated_irs_taker_positions_global_windows = generate_dated_irs_taker_positions_pipeline_and_output(
            dated_irs_taker_position_pipeline=pipeline,
            initiate_taker_order_events_stream=input_stream,
        )
        dated_irs_taker_position_pipeline.run()


if __name__ == "__main__":
    run()
