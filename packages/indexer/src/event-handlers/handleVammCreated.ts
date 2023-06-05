import {
  VammCreatedEvent,
  pullVammCreatedEvent,
  insertVammCreatedEvent,
} from '@voltz-protocol/commons-v2';

export const handleVammCreated = async (event: VammCreatedEvent) => {
  const existingEvent = await pullVammCreatedEvent(event.id);

  if (existingEvent) {
    return;
  }

  await insertVammCreatedEvent(event);
};
