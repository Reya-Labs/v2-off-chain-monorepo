import {
  RateOracleConfiguredEvent,
  pullMarketEntry,
  insertMarketEntry,
  updateMarketEntry,
  pullRateOracleConfiguredEvent,
  insertRateOracleConfiguredEvent,
  sendUpdateBatches,
} from '@voltz-protocol/bigquery-v2';
import {
  ZERO_ADDRESS,
  ZERO_ACCOUNT,
  getTimestampInSeconds,
} from '@voltz-protocol/commons-v2';
import { backfillRateOracle } from '../liquidity-indices/backfillRateOracle';
import { getEnvironmentV2 } from '../services/envVars';

export const handleRateOracleConfigured = async (
  event: RateOracleConfiguredEvent,
) => {
  const environmentTag = getEnvironmentV2();

  const existingEvent = await pullRateOracleConfiguredEvent(
    environmentTag,
    event.id,
  );

  if (existingEvent) {
    return;
  }

  {
    const updateBatch1 = insertRateOracleConfiguredEvent(environmentTag, event);

    // todo: think of how to backfill from moment of swap before and then consistenly
    const updateBatch2 = await backfillRateOracle(
      event.chainId,
      event.oracleAddress,
      getTimestampInSeconds(),
    );

    // Update market
    const existingMarket = await pullMarketEntry(
      environmentTag,
      event.chainId,
      event.marketId,
    );

    const updateBatch3 = existingMarket
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

    await sendUpdateBatches(
      [[updateBatch1], updateBatch2, [updateBatch3]].flat(),
    );
  }
};
