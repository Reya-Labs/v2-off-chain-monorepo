import {
  MarketConfiguredEvent,
  pullMarketEntry,
  insertMarketEntry,
  updateMarketEntry,
  pullMarketConfiguredEvent,
  insertMarketConfiguredEvent,
  sendUpdateBatches,
} from '@voltz-protocol/bigquery-v2';
import { ZERO_ACCOUNT, ZERO_ADDRESS } from '@voltz-protocol/commons-v2';
import { getEnvironmentV2 } from '../services/envVars';

export const handleMarketConfigured = async (event: MarketConfiguredEvent) => {
  const environmentTag = getEnvironmentV2();

  const existingEvent = await pullMarketConfiguredEvent(
    environmentTag,
    event.id,
  );

  if (existingEvent) {
    return;
  }

  {
    const updateBatch1 = insertMarketConfiguredEvent(environmentTag, event);

    const existingMarket = await pullMarketEntry(
      environmentTag,
      event.chainId,
      event.marketId,
    );

    const updateBatch2 = existingMarket
      ? updateMarketEntry(environmentTag, event.chainId, event.marketId, {
          quoteToken: event.quoteToken,
        })
      : insertMarketEntry(environmentTag, {
          chainId: event.chainId,
          marketId: event.marketId,
          quoteToken: event.quoteToken,
          oracleAddress: ZERO_ADDRESS,
          feeCollectorAccountId: ZERO_ACCOUNT,
          atomicMakerFee: 0,
          atomicTakerFee: 0,
        });

    await sendUpdateBatches([updateBatch1, updateBatch2]);
  }
};
