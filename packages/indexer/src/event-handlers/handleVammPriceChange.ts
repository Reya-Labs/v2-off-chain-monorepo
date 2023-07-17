import {
  VammPriceChangeEvent,
  pullVammPriceChangeEvent,
  insertVammPriceChangeEvent,
  pullLpPositionEntries,
  updatePositionEntry,
  sendUpdateBatches,
  getLiquidityIndicesAtByMarketId,
  updateIrsVammPoolEntry,
  pullIrsVammPoolEntry,
} from '@voltz-protocol/bigquery-v2';
import {
  encodeV2PoolId,
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

  const poolId = encodeV2PoolId({
    chainId,
    marketId,
    maturityTimestamp,
  });

  const irsVammPoolEntry = await pullIrsVammPoolEntry(environmentTag, poolId);

  if (irsVammPoolEntry === null) {
    throw new Error(`Could not find Irs Vamm Pool ${poolId}`);
  }

  const latestTick = irsVammPoolEntry.currentTick;

  {
    const updateBatch1 = insertVammPriceChangeEvent(environmentTag, event);

    const updateBatch2 = updateIrsVammPoolEntry(
      environmentTag,
      irsVammPoolEntry.id,
      {
        currentTick,
      },
    );

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

    const activeLpPositions = (
      await pullLpPositionEntries(
        environmentTag,
        chainId,
        marketId,
        maturityTimestamp,
      )
    ).filter((lp) => lp.liquidity > 0);

    const updateBatch3 = activeLpPositions.map((lp) => {
      const { base: baseTradedByTraders, avgFix: avgFixedRate } =
        getLpInfoInRange([lp], latestTick, currentTick);

      const baseDelta = -baseTradedByTraders;

      const timeDelta = (maturityTimestamp - blockTimestamp) / SECONDS_IN_YEAR;
      const quoteDelta =
        -baseDelta * liquidityIndex * (1 + avgFixedRate * timeDelta);

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

    await sendUpdateBatches(
      [[updateBatch1, updateBatch2], updateBatch3].flat(),
    );
  }
};
