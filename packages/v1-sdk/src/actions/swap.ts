import {
  SwapArgs
} from "./actionArgTypes";

import {
  SwapResponse
} from "./actionResponseTypes";

export const swap = async (
  {
    isFT,
    notional,
    margin,
    fixedRateLimit,
    fixedLow,
    fixedHigh,
  }: SwapArgs
): Promise<SwapResponse> => {
  
}