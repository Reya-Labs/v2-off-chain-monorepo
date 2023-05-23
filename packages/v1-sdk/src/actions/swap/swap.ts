import { SwapArgs, SwapPeripheryParams } from "../types/actionArgTypes";

import { SwapResponse } from '../actionResponseTypes';
import { handleSwapErrors } from '../error-handling/handleSwapErrors';
import { BigNumberish } from 'ethers';
import { getClosestTickAndFixedRate } from "./getClosestTickAndFixedRate";
import { getSqrtPriceLimitFromFixedRateLimit } from "./getSqrtPriceLimitFromFixedRate";
import { getDefaultSqrtPriceLimit} from "./getDefaultSqrtPriceLimits";

export const swap = async ({
  isFT,
  notional,
  margin,
  fixedRateLimit,
  fixedLow,
  fixedHigh,
  underlyingTokenAddress,
  tickSpacing,
  peripheryAddress,
  vammAddress,
  provider,
  signer,
  isEth
}: SwapArgs): Promise<SwapResponse> => {
  // todo: layer in validation of tick spacing in handle swap errors or better turn into an enum
  handleSwapErrors({
    notional,
    fixedLow,
    fixedHigh,
    underlyingTokenAddress,
  });

  const { closestUsableTick: tickUpper } = getClosestTickAndFixedRate(fixedLow, tickSpacing);
  const { closestUsableTick: tickLower } = getClosestTickAndFixedRate(fixedHigh, tickSpacing);

  let sqrtPriceLimitX96: BigNumberish = getDefaultSqrtPriceLimit(isFT);
  if (fixedRateLimit) {
    sqrtPriceLimitX96 = getSqrtPriceLimitFromFixedRateLimit(fixedRateLimit, tickSpacing);
  }

  const peripheryContract = getPeripheryContract(
    peripheryAddress,
    signer
  );

  const swapPeripheryParams: SwapPeripheryParams = getSwapPeripheryParams(
    isEth,
    margin,
    isFT,
    notional,
    fixedLow,
    fixedHigh,
  )





  return {
    status: 'success',
  };
};
