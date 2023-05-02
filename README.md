# Deployments

## Workflow Deployment

```
WORKFLOW_NAME=v2-transformer
REGION=europe-west2

gcloud workflows deploy $WORKFLOW_NAME \
--source=workflow.yaml \
--location=$REGION
```

where ```workflow.yaml``` defines the workflow, see an example of a Google Cloud Platform workflow file in
here https://github.com/GoogleCloudPlatform/eventarc-samples/blob/main/processing-pipelines/image-v3/workflow.yaml.

