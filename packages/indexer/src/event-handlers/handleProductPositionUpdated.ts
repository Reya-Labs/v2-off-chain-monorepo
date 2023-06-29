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
    const updateBatch1 = insertProductPositionUpdatedEvent(
      environmentTag,
      event,
    );

    const positionIdData = {
      chainId: event.chainId,
      accountId: event.accountId,
      marketId: event.marketId,
      maturityTimestamp: event.maturityTimestamp,
      type: 'trader' as 'trader' | 'lp',
    };

    const existingPosition = await pullPositionEntry(
      environmentTag,
      positionIdData,
    );

    const market = await pullMarketEntry(
      environmentTag,
      event.chainId,
      event.marketId,
    );

    if (!market) {
      throw new Error(
        `Couldn't find market for ${event.chainId}-${event.marketId}`,
      );
    }

    const liquidityIndex = await getLiquidityIndexAt(
      environmentTag,
      event.chainId,
      market.oracleAddress,
      event.blockTimestamp,
    );

    if (!liquidityIndex) {
      throw new Error(
        `Couldn't find liquidity index at ${event.blockTimestamp} for ${event.chainId}-${market.oracleAddress}`,
      );
    }

    const netBalances = extendBalancesWithTrade({
      tradeTimestamp: event.blockTimestamp,
      maturityTimestamp: event.maturityTimestamp,
      baseDelta: event.baseDelta,
      quoteDelta: event.quoteDelta,
      tradeLiquidityIndex: liquidityIndex,
      existingPosition,
    });

    const updateBatch2 = existingPosition
      ? updatePositionEntry(environmentTag, positionIdData, netBalances)
      : insertPositionEntry(environmentTag, {
          ...positionIdData,
          ...netBalances,
          liquidity: 0,
          paidFees: 0,
          tickLower: 0,
          tickUpper: 0,
          creationTimestamp: event.blockTimestamp,
        });

    await sendUpdateBatches([updateBatch1, updateBatch2]);
  }
};
