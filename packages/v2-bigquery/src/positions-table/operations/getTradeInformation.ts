import {
  VAMM_MAX_TICK,
  VAMM_MIN_TICK,
  getLpInfoInRange,
} from '@voltz-protocol/commons-v2';
import { pullLpPositionEntries } from './pullLpPositionEntries';

export const getTradeAvgFix = async (
  environmentV2Tag: string,
  chainId: number,
  marketId: string,
  maturityTimestamp: number,
  currentTick: number,
  baseToTrade: number,
): Promise<Awaited<ReturnType<typeof getLpInfoInRange>>> => {
  if (baseToTrade === 0) {
    return {
      base: 0,
      avgFix: 0,
    };
  }

  const lpPositions = await pullLpPositionEntries(
    environmentV2Tag,
    chainId,
    marketId,
    maturityTimestamp,
  );

  let pin = currentTick;

  if (baseToTrade < 0) {
    let lo = currentTick;
    let hi = VAMM_MAX_TICK;

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);

      const { base: availableBase } = getLpInfoInRange(
        lpPositions,
        currentTick,
        mid,
      );

      if (-availableBase <= -baseToTrade) {
        lo = mid + 1;
        pin = mid;
      } else {
        hi = mid - 1;
      }
    }
  } else {
    let lo = VAMM_MIN_TICK;
    let hi = currentTick;

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);

      const { base: availableBase } = getLpInfoInRange(
        lpPositions,
        currentTick,
        mid,
      );

      if (availableBase <= baseToTrade) {
        hi = mid - 1;
        pin = mid;
      } else {
        lo = mid + 1;
      }
    }
  }

  return getLpInfoInRange(lpPositions, currentTick, pin);
};
