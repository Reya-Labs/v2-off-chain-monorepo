import { BaseEvent } from '../../utils/types';
import { getPubSubClient } from './clients';

export const pushEvents = async <T extends BaseEvent>(
  topicId: string,
  events: T[],
  checkTopic = true,
) => {
  const pubSubClient = getPubSubClient();

  // check event types
  if (checkTopic) {
    for (const event of events) {
      if (!(event.type === topicId)) {
        throw new Error(
          `Trying to push event of different type (${event.type}) to topic ${topicId}.`,
        );
      }
    }
  }

  for (const event of events) {
    const message = JSON.stringify(event);
    const data = Buffer.from(message);

    const messageId = await pubSubClient
      .topic(topicId)
      .publishMessage({ data });

    console.log(`Message ${messageId} published.`);
  }
};
