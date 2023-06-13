import {
  VammPriceChangeEvent,
  pullVammPriceChangeEvent,
  insertVammPriceChangeEvent,
  getCurrentVammTick,
  pullLpPositionEntries,
  updatePositionEntry,
} from '@voltz-protocol/bigquery-v2';
import { isNull, computePassiveDeltas } from '@voltz-protocol/commons-v2';

export const handleVammPriceChange = async (event: VammPriceChangeEvent) => {
  const existingEvent = await pullVammPriceChangeEvent(event.id);

  if (existingEvent) {
    return;
  }

  const latestTick = await getCurrentVammTick(
    event.chainId,
    event.marketId,
    event.maturityTimestamp,
  );

  if (isNull(latestTick)) {
    throw new Error(
      `Latest tick not found for ${event.chainId} - ${event.marketId} - ${event.maturityTimestamp}`,
    );
  }

  await insertVammPriceChangeEvent(event);

  // todo: improve this naive approach
  const lpPositions = await pullLpPositionEntries(
    event.chainId,
    event.marketId,
    event.maturityTimestamp,
  );

  for (const lp of lpPositions) {
    const { baseDelta, quoteDelta } = computePassiveDeltas({
      liquidity: lp.liquidityBalance,
      tickMove: {
        from: latestTick as number,
        to: event.tick,
      },
      tickRange: {
        lower: lp.tickLower,
        upper: lp.tickUpper,
      },
    });

    // todo: to be fetched from liquidity index table
    const liquidityIndex = 1;
    const notionalDelta = baseDelta * liquidityIndex;

    await updatePositionEntry(lp, {
      baseBalance: lp.baseBalance + baseDelta,
      quoteBalance: lp.quoteBalance + quoteDelta,
      notionalBalance: lp.notionalBalance + notionalDelta,
    });
  }
};
