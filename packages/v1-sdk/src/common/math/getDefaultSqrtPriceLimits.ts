import { BigNumberish } from 'ethers';
import { TickMath } from './tickMath';

export const getDefaultSqrtPriceLimit = (
  isFixedTaker: boolean,
): BigNumberish => {
  if (isFixedTaker) {
    return TickMath.getSqrtRatioAtTick(TickMath.MAX_TICK - 1).toString();
  }
  return TickMath.getSqrtRatioAtTick(TickMath.MIN_TICK + 1).toString();
};
