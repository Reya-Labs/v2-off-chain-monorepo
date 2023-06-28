import {
  MarketFeeConfiguredEvent,
  pullMarketEntry,
  insertMarketEntry,
  updateMarketEntry,
  pullMarketFeeConfiguredEvent,
  insertMarketFeeConfiguredEvent,
  sendUpdateBatches,
} from '@voltz-protocol/bigquery-v2';
import { ZERO_ADDRESS } from '@voltz-protocol/commons-v2';
import { getEnvironmentV2 } from '../services/envVars';

export const handleMarketFeeConfigured = async (
  event: MarketFeeConfiguredEvent,
) => {
  const environmentTag = getEnvironmentV2();

  // Check if the event has been processed
  const existingEvent = await pullMarketFeeConfiguredEvent(
    environmentTag,
    event.id,
  );

  if (existingEvent) {
    return;
  }

  {
    const updateBatch = insertMarketFeeConfiguredEvent(environmentTag, event);
    await sendUpdateBatches([updateBatch]);
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
          feeCollectorAccountId: event.feeCollectorAccountId,
          atomicMakerFee: event.atomicMakerFee,
          atomicTakerFee: event.atomicTakerFee,
        })
      : insertMarketEntry(environmentTag, {
          chainId: event.chainId,
          marketId: event.marketId,
          quoteToken: ZERO_ADDRESS,
          oracleAddress: ZERO_ADDRESS,
          feeCollectorAccountId: event.feeCollectorAccountId,
          atomicMakerFee: event.atomicMakerFee,
          atomicTakerFee: event.atomicTakerFee,
        });

    await sendUpdateBatches([updateBatch]);
  }
};
