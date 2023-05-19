import argparse
from apache_beam.options.pipeline_options import PipelineOptions
import logging
from packages.transformer.src.pipelines.dated_irs_taker_positions.generate_pipeline_and_output import generate_dated_irs_taker_positions_pipeline_and_output

def run():
    logging.getLogger().setLevel(logging.INFO)
    parser = argparse.ArgumentParser(description='Run Voltz V2 Apache Beam Pipelines')
    parser.add_argument(
        "--input",
        help="The Cloud Pub/Sub Topic to read from"
    )
    parser.add_argument(
        "--output",
        help="The Cloud Big Table destination table"
    )
    parser.add_argument(
        "--pipeline",
        help="Name of the pipeline"
    )

    args = parser.parse_args()

    pipeline_options = PipelineOptions(
        streaming=True,
        save_main_session=True,
        job_name=args.pipeline,
        num_workers=10,
        max_num_workers=10
    )



if __name__ == "__main__":
    run()
