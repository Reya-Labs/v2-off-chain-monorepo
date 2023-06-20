import {
  ProductPositionUpdatedEvent,
  getLiquidityIndexAt,
  insertPositionEntry,
  insertProductPositionUpdatedEvent,
  pullMarketEntry,
  pullPositionEntry,
  pullProductPositionUpdatedEvent,
  updatePositionEntry,
} from '@voltz-protocol/bigquery-v2';

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
  const market = await pullMarketEntry(event.chainId, event.marketId);

  if (!market) {
    throw new Error(
      `Couldn't find market for ${event.chainId}-${event.marketId}`,
    );
  }

  const liquidityIndex = await getLiquidityIndexAt(
    market.chainId,
    market.oracleAddress,
    event.blockTimestamp,
  );

  if (!liquidityIndex) {
    throw new Error(
      `Couldn't find liquidity index at ${event.blockTimestamp} for ${market.chainId}-${market.oracleAddress}`,
    );
  }

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
      liquidityBalance: 0,
      paidFees: 0,
      tickLower: 0,
      tickUpper: 0,
      creationTimestamp: event.blockTimestamp,
    });
  }
};
