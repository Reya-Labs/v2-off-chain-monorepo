import {
  VammPriceChangeEvent,
  pullVammPriceChangeEvent,
  insertVammPriceChangeEvent,
  getCurrentVammTick,
  pullLpPositionEntries,
  updatePositionEntry,
  sendUpdateBatches,
  getLiquidityIndicesAtByMarketId,
} from '@voltz-protocol/bigquery-v2';
import {
  isNull,
  extendBalancesWithTrade,
  getLpInfoInRange,
  SECONDS_IN_YEAR,
} from '@voltz-protocol/commons-v2';
import { getEnvironmentV2 } from '../services/envVars';

export const handleVammPriceChange = async (event: VammPriceChangeEvent) => {
  const environmentTag = getEnvironmentV2();

  const existingEvent = await pullVammPriceChangeEvent(
    environmentTag,
    event.id,
  );

  if (existingEvent) {
    return;
  }

  const {
    chainId,
    marketId,
    maturityTimestamp,
    blockTimestamp,
    tick: currentTick,
  } = event;

  const latestTick = await getCurrentVammTick(
    environmentTag,
    chainId,
    marketId,
    maturityTimestamp,
  );

  if (isNull(latestTick)) {
    throw new Error(
      `Latest tick not found for ${chainId} - ${marketId} - ${maturityTimestamp}`,
    );
  }

  {
    const updateBatch1 = insertVammPriceChangeEvent(environmentTag, event);

    const [liquidityIndex] = await getLiquidityIndicesAtByMarketId(
      environmentTag,
      chainId,
      marketId,
      [blockTimestamp],
    );

    if (!liquidityIndex) {
      throw new Error(
        `Couldn't find liquidity index at ${blockTimestamp} for ${chainId}-${marketId}`,
      );
    }

    const lpPositions = await pullLpPositionEntries(
      environmentTag,
      chainId,
      marketId,
      maturityTimestamp,
    );

    const updateBatch2 = lpPositions.map((lp) => {
      const { base: baseTradedByTraders, avgFix: avgFixedRate } =
        getLpInfoInRange([lp], currentTick, latestTick as number);

      const baseDelta = -baseTradedByTraders;
      const quoteDelta =
        -baseDelta *
        liquidityIndex *
        (1 +
          (avgFixedRate * (maturityTimestamp - blockTimestamp)) /
            SECONDS_IN_YEAR);

      const netBalances = extendBalancesWithTrade({
        tradeTimestamp: blockTimestamp,
        maturityTimestamp: maturityTimestamp,
        baseDelta,
        quoteDelta,
        tradeLiquidityIndex: liquidityIndex,
        existingPosition: lp,
      });

      return updatePositionEntry(environmentTag, lp.id, netBalances);
    });

    await sendUpdateBatches([[updateBatch1], updateBatch2].flat());
  }
};
