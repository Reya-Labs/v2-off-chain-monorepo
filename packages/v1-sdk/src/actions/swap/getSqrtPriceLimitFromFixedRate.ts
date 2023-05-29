import { BigNumberish } from 'ethers';
import { getClosestTickAndFixedRate } from './getClosestTickAndFixedRate';
import { TickMath } from '../../common/math/tickMath';

export const getSqrtPriceLimitFromFixedRateLimit = (
  fixedRateLimit: number,
  tickSpacing: number,
): BigNumberish => {
  const { closestUsableTick: tickLimit } = getClosestTickAndFixedRate(
    fixedRateLimit,
    tickSpacing,
  );

  const sqrtPriceLimitX96 = TickMath.getSqrtRatioAtTick(tickLimit).toString();

  return sqrtPriceLimitX96;
};
