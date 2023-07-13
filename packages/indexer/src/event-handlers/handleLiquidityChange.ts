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
import { encodeV2PositionId } from '@voltz-protocol/commons-v2';

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
    const updateBatch1 = insertLiquidityChangeEvent(environmentTag, event);

    const positionIdData = {
      chainId: event.chainId,
      accountId: event.accountId,
      marketId: event.marketId,
      maturityTimestamp: event.maturityTimestamp,
      type: 'lp' as 'trader' | 'lp',
      tickLower: event.tickLower,
      tickUpper: event.tickUpper,
    };
    const positionId = encodeV2PositionId(positionIdData);

    const existingPosition = await pullPositionEntry(
      environmentTag,
      positionId,
    );

    const updateBatch2 = existingPosition
      ? updatePositionEntry(environmentTag, positionId, {
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

    await sendUpdateBatches([updateBatch1, updateBatch2]);
  }
};
