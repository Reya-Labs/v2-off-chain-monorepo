import { SwapPeripheryParams } from '../types';
import { getDefaultSqrtPriceLimit } from '../../common/math/getDefaultSqrtPriceLimits';
import { getSqrtPriceLimitFromFixedRateLimit } from '../../common/math/getSqrtPriceLimitFromFixedRate';
import { scale } from '../../common/math/scale';
import { TRADER_TICK_LOWER, TRADER_TICK_UPPER } from '../../common/constants';

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
    tickLower: TRADER_TICK_LOWER,
    tickUpper: TRADER_TICK_UPPER,
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
