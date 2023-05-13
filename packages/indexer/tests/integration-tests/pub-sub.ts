import {
  createSubscription,
  deleteSubscription,
} from '../../src/services/pub-sub/subscription';
import { createTopic, deleteTopic } from '../../src/services/pub-sub/topic';
import { pullEvents } from '../../src/services/pub-sub/pullEvents';
import { pushEvents } from '../../src/services/pub-sub/pushEvents';
import { compareEvents } from '../utils/compareEvents';
import { TakerOrderEvent } from '../../src/event-parsers/types';
import { takerOrderEvent } from '../utils/mocks';

const topicId = 'integration-test-topic';
const subscriptionName = 'integration-test-subscription';

const cleanUp = async () => {
  // Clean test topic and subscription
  try {
    await deleteTopic(topicId);
  } catch (_) {
    console.log(`Failed to clean up topic ${topicId}`);
  }

  try {
    await deleteSubscription(subscriptionName);
  } catch (_) {
    console.log(`Failed to clean up subscription ${subscriptionName}`);
  }
};

const test = async () => {
  // 1. Create test topic
  console.log(`Creating topic...`);
  await createTopic(topicId);

  // 2. Create subscription to test topic
  console.log(`Creating subscription...`);
  await createSubscription(topicId, subscriptionName);

  // 3. Push 1 event
  console.log(`Pushing events...`);
  await pushEvents(topicId, [takerOrderEvent], false);

  // 4. Pull 1 event
  console.log(`Pulling events...`);
  const receivedEvents = (await pullEvents(
    subscriptionName,
  )) as TakerOrderEvent[];

  console.log(`Checking response...`);

  if (!(receivedEvents.length === 1)) {
    throw new Error(`Pulled events are of length ${receivedEvents.length}`);
  }

  const comparison = compareEvents(receivedEvents[0], takerOrderEvent);
  if (comparison) {
    throw new Error(comparison);
  }
};

test()
  .then(() => {
    console.log(`Passed.`);
  })
  .catch(() => {
    console.log(`Failed.`);
  })
  .finally(() => {
    cleanUp().then(() => {
      console.log('Successfully cleaned up.');
    });
  });
