import {
  LiquidityChangeEvent,
  pullPositionEntry,
  updatePositionEntry,
  insertPositionEntry,
  insertLiquidityChangeEvent,
  pullLiquidityChangeEvent,
} from '@voltz-protocol/bigquery-v2';

export const handleLiquidityChange = async (event: LiquidityChangeEvent) => {
  const existingEvent = await pullLiquidityChangeEvent(event.id);

  if (existingEvent) {
    return;
  }

  await insertLiquidityChangeEvent(event);

  const positionIdData = {
    chainId: event.chainId,
    accountId: event.accountId,
    marketId: event.marketId,
    maturityTimestamp: event.maturityTimestamp,
    type: 'lp' as 'trader' | 'lp',
    tickLower: event.tickLower,
    tickUpper: event.tickUpper,
  };

  const existingPosition = await pullPositionEntry(positionIdData);

  if (existingPosition) {
    await updatePositionEntry(positionIdData, {
      liquidity: existingPosition.liquidity + event.liquidityDelta,
    });
  } else {
    await insertPositionEntry({
      ...positionIdData,
      base: 0,
      timeDependentQuote: 0,
      freeQuote: 0,
      notional: 0,
      lockedFixedRate: 0,
      liquidity: 0,
      paidFees: 0,
      creationTimestamp: event.blockTimestamp,
    });
  }
};
