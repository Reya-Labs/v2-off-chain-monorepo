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

import { extendBalancesWithTrade } from '@voltz-protocol/commons-v2';

export const handleProductPositionUpdated = async (
  event: ProductPositionUpdatedEvent,
) => {
  const existingEvent = await pullProductPositionUpdatedEvent(event.id);

  if (existingEvent) {
    return;
  }

  await insertProductPositionUpdatedEvent(event);

  const {
    chainId,
    accountId,
    marketId,
    maturityTimestamp,
    blockTimestamp,
    baseDelta,
    quoteDelta,
  } = event;

  if (baseDelta === 0) {
    console.log(`Change of 0 base skipped...`);
    return;
  }

  const positionIdData = {
    chainId,
    accountId,
    marketId,
    maturityTimestamp: maturityTimestamp,
    type: 'trader' as 'trader' | 'lp',
  };

  const existingPosition = await pullPositionEntry(positionIdData);
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

  const netBalances = extendBalancesWithTrade({
    tradeTimestamp: blockTimestamp,
    maturityTimestamp,
    baseDelta,
    quoteDelta,
    tradeLiquidityIndex: liquidityIndex,
    existingPosition,
  });

  if (existingPosition) {
    await updatePositionEntry(positionIdData, netBalances);
  } else {
    await insertPositionEntry({
      ...positionIdData,
      ...netBalances,
      liquidity: 0,
      paidFees: 0,
      tickLower: 0,
      tickUpper: 0,
      creationTimestamp: blockTimestamp,
    });
  }
};
