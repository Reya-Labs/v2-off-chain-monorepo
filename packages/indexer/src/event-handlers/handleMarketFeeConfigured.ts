import { MarketFeeConfiguredEvent } from '../event-parsers/types';
import { pullMarketEntry } from '../services/big-query/markets-table/pull-data/pullMarketEntry';
import { insertMarketEntry } from '../services/big-query/markets-table/push-data/insertMarketEntry';
import { updateMarketEntry } from '../services/big-query/markets-table/push-data/updateMarketEntry';
import { pullMarketFeeConfiguredEvent } from '../services/big-query/raw-market-fee-configured-table/pull-data/pullMarketFeeConfiguredEvent';
import { insertMarketFeeConfiguredEvent } from '../services/big-query/raw-market-fee-configured-table/push-data/insertMarketFeeConfiguredEvent';
import { ZERO_ADDRESS } from '../utils/constants';

export const handleMarketFeeConfigured = async (
  event: MarketFeeConfiguredEvent,
) => {
  // Check if the event has been processed
  const existingEvent = await pullMarketFeeConfiguredEvent(event.id);

  if (existingEvent) {
    return;
  }

  await insertMarketFeeConfiguredEvent(event);

  // Update market
  const existingMarket = await pullMarketEntry(event.chainId, event.marketId);

  if (existingMarket) {
    await updateMarketEntry(event.chainId, event.marketId, {
      feeCollectorAccountId: event.feeCollectorAccountId,
      atomicMakerFee: event.atomicMakerFee,
      atomicTakerFee: event.atomicTakerFee,
    });
  } else {
    await insertMarketEntry({
      chainId: event.chainId,
      marketId: event.marketId,
      quoteToken: ZERO_ADDRESS,
      oracleAddress: ZERO_ADDRESS,
      feeCollectorAccountId: event.feeCollectorAccountId,
      atomicMakerFee: event.atomicMakerFee,
      atomicTakerFee: event.atomicTakerFee,
    });
  }
};
