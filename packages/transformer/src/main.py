import argparse
from apache_beam.options.pipeline_options import PipelineOptions
from pipelines.positions.position_pipeline import run_position_pipeline

def main():
    parser = argparse.ArgumentParser(description='Run Voltz V2 Apache Beam Pipelines')
    parser.add_argument('--pipeline', choices=['position_pipeline'], required=True,
                        help='The pipeline to run')
    args = parser.parse_args()

    pipeline_options = PipelineOptions()

    if args.pipeline == 'position_pipeline':
        run_position_pipeline(pipeline_options)

if __name__ == "__main__":
    main()
