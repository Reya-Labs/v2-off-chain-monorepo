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
  marginEngineAddress: string;
  underlyingTokenDecimals: number;
  fixedRateLimit?: number | null;
  tickSpacing: number;
};

export const getSwapPeripheryParams = ({
  margin,
  isFT,
  notional,
  marginEngineAddress,
  underlyingTokenDecimals,
  fixedRateLimit,
  tickSpacing,
}: GetSwapPeripheryParamsArgs): SwapPeripheryParams => {
  const swapPeripheryParams: SwapPeripheryParams = {
    marginEngineAddress: marginEngineAddress,
    isFT: isFT,
    notional: scale(notional, underlyingTokenDecimals),
    sqrtPriceLimitX96: getDefaultSqrtPriceLimit(isFT),
    tickLower: -69060,
    tickUpper: 0,
    marginDelta: scale(margin, underlyingTokenDecimals),
  };

  if (fixedRateLimit) {
    const sqrtPriceLimitX96 = getSqrtPriceLimitFromFixedRateLimit(
      fixedRateLimit,
      tickSpacing,
    );
    swapPeripheryParams.sqrtPriceLimitX96 = sqrtPriceLimitX96;
  }

  return swapPeripheryParams;
};
