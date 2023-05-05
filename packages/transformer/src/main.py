import argparse
from apache_beam.options.pipeline_options import PipelineOptions
from pipelines.initiate_taker_order_pipeline import run_initiate_taker_order_pipeline
from pipelines.deposit_pipeline import run_deposit_pipeline

def main():
    parser = argparse.ArgumentParser(description='Run Voltz V2 Dataflow Pipelines')
    parser.add_argument('--pipeline', choices=['initiate_taker_order_pipeline', 'deposit_pipeline'], required=True,
                        help='The pipeline to run')
    args = parser.parse_args()

    # You can customize the options here as needed
    pipeline_options = PipelineOptions()

    if args.pipeline == 'pipeline1':
        run_initiate_taker_order_pipeline(pipeline_options)
    elif args.pipeline == 'pipeline2':
        run_deposit_pipeline(pipeline_options)

if __name__ == "__main__":
    main()
