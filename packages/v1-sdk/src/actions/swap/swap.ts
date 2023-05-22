import {
  SwapArgs
} from "../types/actionArgTypes";

import {
  SwapResponse
} from "../actionResponseTypes";
import { handleSwapErrors } from "../error-handling/handleSwapErrors";
import { BigNumberish } from "ethers";

export const swap = async (
  {
    isFT,
    notional,
    margin,
    fixedRateLimit,
    fixedLow,
    fixedHigh,
    underlyingTokenId
  }: SwapArgs
): Promise<SwapResponse> => {
  handleSwapErrors(
    {
      notional, fixedLow, fixedHigh, underlyingTokenId
    }
  );

  

  return {
    status: "success"
  }


}