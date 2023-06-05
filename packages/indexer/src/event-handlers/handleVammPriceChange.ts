import {
  VammPriceChangeEvent,
  pullVammPriceChangeEvent,
  insertVammPriceChangeEvent,
} from '@voltz-protocol/commons-v2';

export const handleVammPriceChange = async (event: VammPriceChangeEvent) => {
  const existingEvent = await pullVammPriceChangeEvent(event.id);

  if (existingEvent) {
    return;
  }

  await insertVammPriceChangeEvent(event);
};
