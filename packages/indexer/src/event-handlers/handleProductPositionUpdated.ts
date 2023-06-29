import {
  ProductPositionUpdatedEvent,
  getLiquidityIndexAt,
  insertPositionEntry,
  insertProductPositionUpdatedEvent,
  pullMarketEntry,
  pullPositionEntry,
  pullProductPositionUpdatedEvent,
  sendUpdateBatches,
  updatePositionEntry,
} from '@voltz-protocol/bigquery-v2';

import { extendBalancesWithTrade } from '@voltz-protocol/commons-v2';
import { log } from '../logging/log';
import { getEnvironmentV2 } from '../services/envVars';

export const handleProductPositionUpdated = async (
  event: ProductPositionUpdatedEvent,
) => {
  const environmentTag = getEnvironmentV2();
  const existingEvent = await pullProductPositionUpdatedEvent(
    environmentTag,
    event.id,
  );

  if (existingEvent) {
    return;
  }

  {
    const updateBatch = insertProductPositionUpdatedEvent(
      environmentTag,
      event,
    );
    await sendUpdateBatches([updateBatch]);
  }

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
    log(`Change of 0 base skipped...`);
    return;
  }

  const positionIdData = {
    chainId,
    accountId,
    marketId,
    maturityTimestamp: maturityTimestamp,
    type: 'trader' as 'trader' | 'lp',
  };

  const existingPosition = await pullPositionEntry(
    environmentTag,
    positionIdData,
  );

  const market = await pullMarketEntry(environmentTag, chainId, marketId);

  if (!market) {
    throw new Error(`Couldn't find market for ${chainId}-${marketId}`);
  }

  const liquidityIndex = await getLiquidityIndexAt(
    environmentTag,
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

  {
    const updateBatch = existingPosition
      ? updatePositionEntry(environmentTag, positionIdData, netBalances)
      : insertPositionEntry(environmentTag, {
          ...positionIdData,
          ...netBalances,
          liquidity: 0,
          paidFees: 0,
          tickLower: 0,
          tickUpper: 0,
          creationTimestamp: blockTimestamp,
        });

    await sendUpdateBatches([updateBatch]);
  }
};
