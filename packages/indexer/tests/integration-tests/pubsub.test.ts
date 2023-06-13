import {
  createSubscription,
  deleteSubscription,
} from '../../src/services/pub-sub/subscription';
import { createTopic, deleteTopic } from '../../src/services/pub-sub/topic';
import { pullEvents } from '../../src/services/pub-sub/pullEvents';
import { pushEvents } from '../../src/services/pub-sub/pushEvents';
import { compareEvents } from '../utils/compareEvents';
import {
  ProtocolEventType,
  TakerOrderEvent,
} from '@voltz-protocol/bigquery-v2';
import { parseTakerOrder } from '../../src/event-parsers/parseTakerOrder';
import { evmTestEvents } from '../utils/evmTestEvents';

const topicId = 'integration-test-topic';
const subscriptionName = 'integration-test-subscription';

jest.setTimeout(100_000);

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
  const chainId = 1;
  const type = ProtocolEventType.taker_order;
  const takerOrderEvmEvent = evmTestEvents[type];

  const takerOrderEvent = parseTakerOrder(chainId, takerOrderEvmEvent);

  // 1. Create test topic
  await createTopic(topicId);

  // 2. Create subscription to test topic
  await createSubscription(topicId, subscriptionName);

  // 3. Push 1 event
  await pushEvents(topicId, [takerOrderEvent], false);

  // 4. Pull 1 event
  const receivedEvents = (await pullEvents(
    subscriptionName,
  )) as TakerOrderEvent[];

  expect(receivedEvents.length).toBe(1);

  const comparison = compareEvents(receivedEvents[0], takerOrderEvent);
  expect(comparison).toBe(null);
};

describe.skip('PubSub integration test', () => {
  afterAll(cleanUp);

  it('simple flow', test);
});
