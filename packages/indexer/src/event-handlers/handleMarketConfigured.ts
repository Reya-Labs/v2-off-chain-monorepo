import { MarketConfiguredEvent } from '../event-parsers/types';
import { pullMarketConfiguredEvent } from '../services/big-query/raw-market-configured-table/pull-data/pullMarketConfiguredEvent';
import { insertMarketConfiguredEvent } from '../services/big-query/raw-market-configured-table/push-data/insertMarketConfiguredEvent';

export const handleMarketConfigured = async (event: MarketConfiguredEvent) => {
  const existingEvent = await pullMarketConfiguredEvent(event.id);

  if (existingEvent) {
    return;
  }

  await insertMarketConfiguredEvent(event);
};
