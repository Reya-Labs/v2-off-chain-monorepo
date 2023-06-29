import {
  LiquidityChangeEvent,
  pullPositionEntry,
  updatePositionEntry,
  insertPositionEntry,
  insertLiquidityChangeEvent,
  pullLiquidityChangeEvent,
  sendUpdateBatches,
} from '@voltz-protocol/bigquery-v2';
import { getEnvironmentV2 } from '../services/envVars';

export const handleLiquidityChange = async (event: LiquidityChangeEvent) => {
  const environmentTag = getEnvironmentV2();
  const existingEvent = await pullLiquidityChangeEvent(
    environmentTag,
    event.id,
  );

  if (existingEvent) {
    return;
  }

  {
    const updateBatch = insertLiquidityChangeEvent(environmentTag, event);
    await sendUpdateBatches([updateBatch]);
  }

  const positionIdData = {
    chainId: event.chainId,
    accountId: event.accountId,
    marketId: event.marketId,
    maturityTimestamp: event.maturityTimestamp,
    type: 'lp' as 'trader' | 'lp',
    tickLower: event.tickLower,
    tickUpper: event.tickUpper,
  };

  const existingPosition = await pullPositionEntry(
    environmentTag,
    positionIdData,
  );

  {
    const updateBatch = existingPosition
      ? updatePositionEntry(environmentTag, positionIdData, {
          liquidity: existingPosition.liquidity + event.liquidityDelta,
        })
      : insertPositionEntry(environmentTag, {
          ...positionIdData,
          base: 0,
          timeDependentQuote: 0,
          freeQuote: 0,
          notional: 0,
          lockedFixedRate: 0,
          liquidity: event.liquidityDelta,
          paidFees: 0,
          creationTimestamp: event.blockTimestamp,
        });

    await sendUpdateBatches([updateBatch]);
  }
};
