import { MarketFeeConfiguredEvent } from '../event-parsers/types';
import { pullMarketFeeConfiguredEvent } from '../services/big-query/raw-market-fee-configured-table/pull-data/pullMarketFeeConfiguredEvent';
import { insertMarketFeeConfiguredEvent } from '../services/big-query/raw-market-fee-configured-table/push-data/insertMarketFeeConfiguredEvent';

export const handleMarketFeeConfigured = async (
  event: MarketFeeConfiguredEvent,
) => {
  const existingEvent = await pullMarketFeeConfiguredEvent(event.id);

  if (existingEvent) {
    return;
  }

  await insertMarketFeeConfiguredEvent(event);
};
