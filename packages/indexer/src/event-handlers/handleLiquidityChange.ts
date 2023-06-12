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
      liquidityBalance:
        existingPosition.liquidityBalance + event.liquidityDelta,
    });
  } else {
    await insertPositionEntry({
      ...positionIdData,
      baseBalance: 0,
      quoteBalance: 0,
      notionalBalance: 0,
      liquidityBalance: event.liquidityDelta,
      paidFees: 0,
    });
  }
};
