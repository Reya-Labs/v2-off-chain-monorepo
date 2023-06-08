import { SwapArgs, SwapPeripheryParams } from '../types/actionArgTypes';
import { BigNumberish } from 'ethers';
import { getDefaultSqrtPriceLimit } from '../../common/math/getDefaultSqrtPriceLimits';
import { getSqrtPriceLimitFromFixedRateLimit } from '../../common/math/getSqrtPriceLimitFromFixedRate';
import { getClosestTickAndFixedRate } from '../../common/math/getClosestTickAndFixedRate';
import { scale } from '../../common/math/scale';

export type GetSwapPeripheryParamsArgs = {
  margin: number;
  isFT: boolean;
  notional: number;
  fixedLow: number;
  fixedHigh: number;
  marginEngineAddress: string;
  underlyingTokenDecimals: number;
  fixedRateLimit?: number | null;
  tickSpacing: number;
};

export const getSwapPeripheryParams = ({
  margin,
  isFT,
  notional,
  fixedLow,
  fixedHigh,
  marginEngineAddress,
  underlyingTokenDecimals,
  fixedRateLimit,
  tickSpacing,
}: GetSwapPeripheryParamsArgs): SwapPeripheryParams => {
  const swapPeripheryParams: SwapPeripheryParams = {
    marginEngineAddress: marginEngineAddress,
    isFT: isFT,
    notional: scale(notional, underlyingTokenDecimals),
    sqrtPriceLimitX96: 0,
    tickLower: getClosestTickAndFixedRate(fixedHigh, tickSpacing)
      .closestUsableTick,
    tickUpper: getClosestTickAndFixedRate(fixedLow, tickSpacing)
      .closestUsableTick,
    marginDelta: scale(margin, underlyingTokenDecimals),
  };

  let sqrtPriceLimitX96: BigNumberish = getDefaultSqrtPriceLimit(isFT);
  if (fixedRateLimit) {
    sqrtPriceLimitX96 = getSqrtPriceLimitFromFixedRateLimit(
      fixedRateLimit,
      tickSpacing,
    );
  }

  swapPeripheryParams.sqrtPriceLimitX96 = sqrtPriceLimitX96;

  return swapPeripheryParams;
};
