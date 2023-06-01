import { MarketConfiguredEvent } from '../event-parsers/types';
import { pullMarketEntry } from '../services/big-query/markets-table/pull-data/pullMarketEntry';
import { insertMarketEntry } from '../services/big-query/markets-table/push-data/insertMarketEntry';
import { updateMarketEntry } from '../services/big-query/markets-table/push-data/updateMarketEntry';
import { pullMarketConfiguredEvent } from '../services/big-query/raw-market-configured-table/pull-data/pullMarketConfiguredEvent';
import { insertMarketConfiguredEvent } from '../services/big-query/raw-market-configured-table/push-data/insertMarketConfiguredEvent';
import { ZERO_ACCOUNT, ZERO_ADDRESS } from '../utils/constants';

export const handleMarketConfigured = async (event: MarketConfiguredEvent) => {
  // Check if the event has been processed
  const existingEvent = await pullMarketConfiguredEvent(event.id);

  if (existingEvent) {
    return;
  }

  await insertMarketConfiguredEvent(event);

  // Update market
  const existingMarket = await pullMarketEntry(event.chainId, event.marketId);

  if (existingMarket) {
    await updateMarketEntry(event.chainId, event.marketId, {
      quoteToken: event.quoteToken,
    });
  } else {
    await insertMarketEntry({
      chainId: event.chainId,
      marketId: event.marketId,
      quoteToken: event.quoteToken,
      oracleAddress: ZERO_ADDRESS,
      feeCollectorAccountId: ZERO_ACCOUNT,
      atomicMakerFee: 0,
      atomicTakerFee: 0,
    });
  }
};
