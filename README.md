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

## Create an Event Arc Trigger

Eventarc is a serverless eventing platform provided by GCP.
It enables triggering of Cloud Run services, Cloud Functions, and other targets
in response to events from various sources.

Eventarc's integration with pub/sub as a source allows you to use Eventarc for events raised by a custom application
(e.g. the v2 indexer responsible for parsing on-chain events and pushing them to a database such as BigQuery).

## Event-driven approach

Provides the ability to reduce dependencies and complexity in the application while
still allowing the creation of more services. It allows for true separation of concern.
This means that a producer need not know how an event will be consumed, or a take on any dependency
from a downstream service.

The consumer only needs to know that the event will be raised and understand how to utilize it, none of the details of
the upstream service.

With this loosely coupled approach, we eliminate hard dependencies between services. Eventarc is a managed event system:

- select the google cloud service or pub/sub topic you are interested in as a source
- define the filter parameters
- choose the target you wish to invoke

Note, google uses pub/sub in the background as a transport layer.

## Pub/Sub

Pub/sub is a fully-managed real-time messaging service that allows sending and receiving messages
between independent applications. Once an event is successfully published as a message, it becomes the job
of the service to ensure that all the systems that need to react to this event get it. The idea behind async
integrations is to react to events represented as messages.
Messages can be received either by a push or a pull.

