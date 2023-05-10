import {
  createSubscription,
  deleteSubscription,
} from '../src/services/pub-sub/subscription';
import { createTopic, deleteTopic } from '../src/services/pub-sub/topic';
import { pullEvents } from '../src/services/pub-sub/pullEvents';
import { pushEvents } from '../src/services/pub-sub/pushEvents';
import { compareEvents } from '../tests/event-parsers/compareEvents';
import { TakerOrderEvent } from '../src/event-parsers/types';

const topicId = 'integration-test-topic';
const subscriptionName = 'integration-test-subscription';

const takerOrderEvent: TakerOrderEvent = {
  id: '1_taker-order_block-hash_0x2ef67d6f04295106894d762e66c6fd39ba36c02d43dac503df0bc7272803f40a_124',
  type: 'taker-order',

  chainId: 1,
  source: '0xe9a6569995f3d8ec971f1d314e0e832c38a735cc',

  blockTimestamp: 1683092975,
  blockNumber: 17178234,
  blockHash: 'block-hash',

  transactionIndex: 21,
  transactionHash:
    '0x2ef67d6f04295106894d762e66c6fd39ba36c02d43dac503df0bc7272803f40a',
  logIndex: 124,

  accountId: 'account-id',

  marketId: 'market-id',
  maturityTimestamp: 1685534400,
  quoteToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',

  executedBaseAmount: 100,
  executedQuoteAmount: -550,

  annualizedBaseAmount: 7.5,
};

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
