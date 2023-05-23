import { SwapArgs, SwapPeripheryParams } from "../types/actionArgTypes";
import { BigNumberish } from "ethers";
import { getDefaultSqrtPriceLimit } from "./getDefaultSqrtPriceLimits";
import { getSqrtPriceLimitFromFixedRateLimit } from "./getSqrtPriceLimitFromFixedRate";
import { getClosestTickAndFixedRate } from "./getClosestTickAndFixedRate";
import { scale } from "../../common/math/scale";

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
}

export const getSwapPeripheryParams = (
  {
    margin,
    isFT,
    notional,
    fixedLow,
    fixedHigh,
    marginEngineAddress,
    underlyingTokenDecimals,
    fixedRateLimit,
    tickSpacing
  }: GetSwapPeripheryParamsArgs
): SwapPeripheryParams => {

  let swapPeripheryParams: SwapPeripheryParams = {
    marginEngineAddress: marginEngineAddress,
    isFT: isFT,
    notional: 0,
    sqrtPriceLimitX96: 0,
    tickLower: 0,
    tickUpper: 0,
    marginDelta: 0
  }

  let sqrtPriceLimitX96: BigNumberish = getDefaultSqrtPriceLimit(isFT);
  if (fixedRateLimit) {
    sqrtPriceLimitX96 = getSqrtPriceLimitFromFixedRateLimit(fixedRateLimit, tickSpacing);
  }

  const { closestUsableTick: tickUpper } = getClosestTickAndFixedRate(fixedLow, tickSpacing);
  const { closestUsableTick: tickLower } = getClosestTickAndFixedRate(fixedHigh, tickSpacing);

  swapPeripheryParams.notional = scale(valueToScale=notional, scalingFactor=underlyingTokenDecimals);
  swapPeripheryParams.marginDelta = scale(margin, underlyingTokenDecimals);
  swapPeripheryParams.sqrtPriceLimitX96 = sqrtPriceLimitX96;
  swapPeripheryParams.tickLower = tickLower;
  swapPeripheryParams.tickUpper = tickUpper;

  return swapPeripheryParams;
}