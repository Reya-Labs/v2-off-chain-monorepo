import {
  VammCreatedEvent,
  pullVammCreatedEvent,
  insertVammCreatedEvent,
  insertVammPriceChangeEvent,
} from '@voltz-protocol/bigquery-v2';

export const handleVammCreated = async (event: VammCreatedEvent) => {
  const existingEvent = await pullVammCreatedEvent(event.id);

  if (existingEvent) {
    return;
  }

  await insertVammCreatedEvent(event);
  await insertVammPriceChangeEvent(event);
};
