import {
  SwapArgs
} from "../types/actionArgTypes";

import {
  SwapResponse
} from "../actionResponseTypes";
import { handleSwapErrors } from "../error-handling/handleSwapErrors";

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