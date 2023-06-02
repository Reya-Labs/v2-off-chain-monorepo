import { VammPriceChangeEvent } from '../event-parsers/types';
import { pullVammPriceChangeEvent } from '../services/big-query/raw-vamm-price-change-table/pull-data/pullVammPriceChangeEvent';
import { insertVammPriceChangeEvent } from '../services/big-query/raw-vamm-price-change-table/push-data/insertVammChangeEvent';

export const handleVammPriceChange = async (event: VammPriceChangeEvent) => {
  const existingEvent = await pullVammPriceChangeEvent(event.id);

  if (existingEvent) {
    return;
  }

  await insertVammPriceChangeEvent(event);
};
