import { TakerOrderEvent } from '../../utils/types';
import { getSubClient, getSubscriptionId } from './clients';

export const pullEvents = async (subscriptionName: string) => {
  const subClient = getSubClient();

  const [response] = await subClient.pull({
    subscription: getSubscriptionId(subscriptionName),
    maxMessages: 10,
  });

  const events = (response.receivedMessages || []).map(({ message }) => {
    console.log(`Message ${message?.messageId} pulled.`);
    const event = JSON.parse((message?.data || '') as string);

    switch (event.type) {
      case 'taker-order': {
        return event as TakerOrderEvent;
      }
      default: {
        throw new Error(`Unrecognized type of pulled event: ${event.type}`);
      }
    }
  });

  return events;
};
