import { getPubSubClient } from './clients';

export const createTopic = async (topicId: string) => {
  console.log('A');
  const pubSubClient = getPubSubClient();
  console.log('B');
  const topic = await pubSubClient.createTopic(topicId);
  console.log(`Created topic: ${topic[0].name}`);
};

export const deleteTopic = async (topicId: string) => {
  const pubSubClient = getPubSubClient();
  await pubSubClient.topic(topicId).delete();
  console.log(`Deleted topic: ${topicId}`);
};
