import {
  SwapArgs
} from "../types/actionArgTypes";

import {
  SwapResponse
} from "../actionResponseTypes";
import { handleSwapErrors } from "../error-handling/handleSwapErrors";

export const executeSwap = async (
  {

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