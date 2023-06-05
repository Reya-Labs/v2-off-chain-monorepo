import {
  RateOracleConfiguredEvent,
  pullMarketEntry,
  insertMarketEntry,
  updateMarketEntry,
  pullRateOracleConfiguredEvent,
  insertRateOracleConfiguredEvent,
  ZERO_ACCOUNT,
  ZERO_ADDRESS,
} from '@voltz-protocol/commons-v2';

export const handleRateOracleConfigured = async (
  event: RateOracleConfiguredEvent,
) => {
  // Check if the event has been processed
  const existingEvent = await pullRateOracleConfiguredEvent(event.id);

  if (existingEvent) {
    return;
  }

  await insertRateOracleConfiguredEvent(event);

  // Update market
  const existingMarket = await pullMarketEntry(event.chainId, event.marketId);

  if (existingMarket) {
    await updateMarketEntry(event.chainId, event.marketId, {
      oracleAddress: event.oracleAddress,
    });
  } else {
    await insertMarketEntry({
      chainId: event.chainId,
      marketId: event.marketId,
      quoteToken: ZERO_ADDRESS,
      oracleAddress: event.oracleAddress,
      feeCollectorAccountId: ZERO_ACCOUNT,
      atomicMakerFee: 0,
      atomicTakerFee: 0,
    });
  }
};
