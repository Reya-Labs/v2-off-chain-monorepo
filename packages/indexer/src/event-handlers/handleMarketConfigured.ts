import {
  MarketConfiguredEvent,
  pullMarketEntry,
  insertMarketEntry,
  updateMarketEntry,
  pullMarketConfiguredEvent,
  insertMarketConfiguredEvent,
  ZERO_ACCOUNT,
  ZERO_ADDRESS,
} from '@voltz-protocol/commons-v2';

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
