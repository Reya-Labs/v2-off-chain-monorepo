import { getPubSubClient, getSubscriptionId } from './clients';

export const createSubscription = async (
  topicId: string,
  subscriptionName: string,
) => {
  const pubSubClient = getPubSubClient();
  const subscription = await pubSubClient.createSubscription(
    topicId,
    subscriptionName,
  );
  console.log(
    `Created subscription to topicId ${topicId}: ${subscription[0].name}`,
  );
};

export const deleteSubscription = async (subscriptionName: string) => {
  const pubSubClient = getPubSubClient();

  await pubSubClient.subscription(getSubscriptionId(subscriptionName)).delete();
  console.log(`Subscription ${subscriptionName} deleted.`);
};
