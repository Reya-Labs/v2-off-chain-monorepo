import {
  MarketFeeConfiguredEvent,
  pullMarketEntry,
  insertMarketEntry,
  updateMarketEntry,
  pullMarketFeeConfiguredEvent,
  insertMarketFeeConfiguredEvent,
} from '@voltz-protocol/bigquery-v2';
import { ZERO_ADDRESS } from '@voltz-protocol/commons-v2';

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
