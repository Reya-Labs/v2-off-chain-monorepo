import { SwapArgs, SwapPeripheryParams } from "../types/actionArgTypes";

import { SwapResponse } from '../actionResponseTypes';
import { handleSwapErrors } from '../error-handling/handleSwapErrors';
import { BigNumberish, ethers } from "ethers";
import { getClosestTickAndFixedRate } from "./getClosestTickAndFixedRate";
import { getSqrtPriceLimitFromFixedRateLimit } from "./getSqrtPriceLimitFromFixedRate";
import { getDefaultSqrtPriceLimit} from "./getDefaultSqrtPriceLimits";
import { executeSwap } from "./executeSwap";
import {getPeripheryContract} from "../../common/contract-generators/getPeripheryContract";
import { getSwapPeripheryParams } from "./getSwapPeripheryParams";

export const swap = async ({
  isFT,
  notional,
  margin,
  fixedRateLimit,
  fixedLow,
  fixedHigh,
  underlyingTokenAddress,
  underlyingTokenDecimals,
  tickSpacing,
  peripheryAddress,
  marginEngineAddress,
  provider,
  signer,
  isEth
}: SwapArgs): Promise<SwapResponse> => {
  // todo: layer in validation of tick spacing in handle swap errors or better turn into an enum
  handleSwapErrors({
    notional,
    fixedLow,
    fixedHigh,
    underlyingTokenAddress
  });

  let peripheryContract: ethers.Contract = getPeripheryContract(
    peripheryAddress,
    provider
  );

  peripheryContract.connect(signer);

  const swapPeripheryParams: SwapPeripheryParams = getSwapPeripheryParams(
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
    }

  )

  return await executeSwap(swapPeripheryParams);

};
