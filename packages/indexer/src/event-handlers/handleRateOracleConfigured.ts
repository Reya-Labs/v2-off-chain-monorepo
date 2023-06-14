import {
  RateOracleConfiguredEvent,
  pullMarketEntry,
  insertMarketEntry,
  updateMarketEntry,
  pullRateOracleConfiguredEvent,
  insertRateOracleConfiguredEvent,
  pullLiquidityIndices,
} from '@voltz-protocol/bigquery-v2';
import { ZERO_ADDRESS, ZERO_ACCOUNT } from '@voltz-protocol/commons-v2';
import { backfillRateOracle } from '../liquidity-indices/backfillRateOracle';

export const handleRateOracleConfigured = async (
  event: RateOracleConfiguredEvent,
) => {
  // Check if the event has been processed
  const existingEvent = await pullRateOracleConfiguredEvent(event.id);

  if (existingEvent) {
    return;
  }

  await insertRateOracleConfiguredEvent(event);

  // Backfill liquidity indices for the new rate oracle
  const existingLiquidityIndices = await pullLiquidityIndices(
    event.chainId,
    event.oracleAddress,
  );

  if (existingLiquidityIndices.length === 0) {
    await backfillRateOracle(event.chainId, event.oracleAddress);
  }

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
