import { SwapArgs, SwapPeripheryParams } from "../types/actionArgTypes";
import { BigNumberish } from "ethers";
import { getDefaultSqrtPriceLimit } from "./getDefaultSqrtPriceLimits";
import { getSqrtPriceLimitFromFixedRateLimit } from "./getSqrtPriceLimitFromFixedRate";
import { getClosestTickAndFixedRate } from "./getClosestTickAndFixedRate";


export const getSwapPeripheryParams = (
  {
    isEth,
    margin,
    isFT,
    notional,
    fixedLow,
    fixedHigh,
    marginEngineAddress,
    underlyingTokenDecimals,
    fixedRateLimit
  }: SwapArgs
): SwapPeripheryParams => {

  let swapPeripheryParams: SwapPeripheryParams = {
    marginEngineAddress: marginEngineAddress,
    isFT: isFT,
    notional: scale(notional, underlyingTokenDecimals),
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

  // sort out margin (incl. eth)



}