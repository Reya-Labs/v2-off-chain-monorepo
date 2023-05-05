import { PubSub } from '@google-cloud/pubsub';
import { v1 } from '@google-cloud/pubsub';

const PROJECT_ID = 'voltz-v2-infra';

let pubSubClient: PubSub | null;
export const getPubSubClient = (): PubSub => {
  if (!pubSubClient) {
    pubSubClient = new PubSub({ projectId: PROJECT_ID });
  }

  return pubSubClient;
};

let subClient: v1.SubscriberClient | null;
export const getSubClient = (): v1.SubscriberClient => {
  if (!subClient) {
    subClient = new v1.SubscriberClient({ projectId: PROJECT_ID });
  }

  return subClient;
};

export const getSubscriptionId = (subscriptionName: string) => {
  return `projects/${PROJECT_ID}/subscriptions/${subscriptionName}`;
};
