import {
  VammPriceChangeEvent,
  pullVammPriceChangeEvent,
  insertVammPriceChangeEvent,
  getCurrentVammTick,
  pullLpPositionEntries,
  updatePositionEntry,
  pullMarketEntry,
  getLiquidityIndexAt,
} from '@voltz-protocol/bigquery-v2';
import { isNull, computePassiveDeltas } from '@voltz-protocol/commons-v2';
import { getPositionNetBalances } from './utils/getPositionNetBalances';

export const handleVammPriceChange = async (event: VammPriceChangeEvent) => {
  const existingEvent = await pullVammPriceChangeEvent(event.id);

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
    chainId,
    marketId,
    maturityTimestamp,
  );

  if (isNull(latestTick)) {
    throw new Error(
      `Latest tick not found for ${chainId} - ${marketId} - ${maturityTimestamp}`,
    );
  }

  await insertVammPriceChangeEvent(event);

  const market = await pullMarketEntry(chainId, marketId);

  if (!market) {
    throw new Error(`Couldn't find market for ${chainId}-${marketId}`);
  }

  const liquidityIndex = await getLiquidityIndexAt(
    chainId,
    market.oracleAddress,
    blockTimestamp,
  );

  if (!liquidityIndex) {
    throw new Error(
      `Couldn't find liquidity index at ${blockTimestamp} for ${chainId}-${market.oracleAddress}`,
    );
  }

  // todo: improve this naive approach
  const lpPositions = await pullLpPositionEntries(
    chainId,
    marketId,
    maturityTimestamp,
  );

  for (const lp of lpPositions) {
    const { baseDelta, quoteDelta } = computePassiveDeltas({
      liquidity: lp.liquidity,
      tickMove: {
        from: latestTick as number,
        to: currentTick,
      },
      tickRange: {
        lower: lp.tickLower,
        upper: lp.tickUpper,
      },
    });

    if (baseDelta === 0) {
      console.log(`Change of 0 base skipped...`);
      return;
    }

    const netBalances = getPositionNetBalances({
      tradeTimestamp: blockTimestamp,
      maturityTimestamp: maturityTimestamp,
      baseDelta,
      quoteDelta,
      tradeLiquidityIndex: liquidityIndex,
      existingPosition: lp,
    });

    await updatePositionEntry(lp, netBalances);
  }
};
