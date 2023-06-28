import {
  RateOracleConfiguredEvent,
  pullMarketEntry,
  insertMarketEntry,
  updateMarketEntry,
  pullRateOracleConfiguredEvent,
  insertRateOracleConfiguredEvent,
  pullLiquidityIndices,
  sendUpdateBatches,
} from '@voltz-protocol/bigquery-v2';
import { ZERO_ADDRESS, ZERO_ACCOUNT } from '@voltz-protocol/commons-v2';
import { backfillRateOracle } from '../liquidity-indices/backfillRateOracle';
import { getEnvironmentV2 } from '../services/envVars';

export const handleRateOracleConfigured = async (
  event: RateOracleConfiguredEvent,
) => {
  const environmentTag = getEnvironmentV2();

  // Check if the event has been processed
  const existingEvent = await pullRateOracleConfiguredEvent(
    environmentTag,
    event.id,
  );

  if (existingEvent) {
    return;
  }

  {
    const updateBatch = insertRateOracleConfiguredEvent(environmentTag, event);
    await sendUpdateBatches([updateBatch]);
  }

  // Backfill liquidity indices for the new rate oracle
  const existingLiquidityIndices = await pullLiquidityIndices(
    environmentTag,
    event.chainId,
    event.oracleAddress,
  );

  if (existingLiquidityIndices.length === 0) {
    await backfillRateOracle(event.chainId, event.oracleAddress);
  }

  // Update market
  const existingMarket = await pullMarketEntry(
    environmentTag,
    event.chainId,
    event.marketId,
  );

  {
    const updateBatch = existingMarket
      ? updateMarketEntry(environmentTag, event.chainId, event.marketId, {
          oracleAddress: event.oracleAddress,
        })
      : insertMarketEntry(environmentTag, {
          chainId: event.chainId,
          marketId: event.marketId,
          quoteToken: ZERO_ADDRESS,
          oracleAddress: event.oracleAddress,
          feeCollectorAccountId: ZERO_ACCOUNT,
          atomicMakerFee: 0,
          atomicTakerFee: 0,
        });

    await sendUpdateBatches([updateBatch]);
  }
};
