import {
  ProductPositionUpdatedEvent,
  insertPositionEntry,
  insertProductPositionUpdatedEvent,
  pullPositionEntry,
  pullProductPositionUpdatedEvent,
  updatePositionEntry,
} from '@voltz-protocol/commons-v2';

export const handleProductPositionUpdated = async (
  event: ProductPositionUpdatedEvent,
) => {
  const existingEvent = await pullProductPositionUpdatedEvent(event.id);

  if (existingEvent) {
    return;
  }

  await insertProductPositionUpdatedEvent(event);

  const positionIdData = {
    chainId: event.chainId,
    accountId: event.accountId,
    marketId: event.marketId,
    maturityTimestamp: event.maturityTimestamp,
    type: 'trader' as 'trader' | 'lp',
  };

  const existingPosition = await pullPositionEntry(positionIdData);

  // todo: to be fetched from liquidity index table
  const liquidityIndex = 1;
  const notionalDelta = event.baseDelta * liquidityIndex;

  if (existingPosition) {
    await updatePositionEntry(positionIdData, {
      baseBalance: existingPosition.baseBalance + event.baseDelta,
      quoteBalance: existingPosition.quoteBalance + event.quoteDelta,
      notionalBalance: existingPosition.notionalBalance + notionalDelta,
    });
  } else {
    await insertPositionEntry({
      ...positionIdData,
      baseBalance: event.baseDelta,
      quoteBalance: event.quoteDelta,
      notionalBalance: notionalDelta,
      paidFees: 0,
      tickLower: 0,
      tickUpper: 0,
    });
  }
};
