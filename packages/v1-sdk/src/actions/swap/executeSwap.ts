import { SwapPeripheryParams } from '../types/actionArgTypes';
import { SwapResponse } from "../actionResponseTypes";

export const executeSwap = async ({
  marginEngine,
  isFT,
  notional,
  sqrtPriceLimitX96,
  tickLower,
  tickUpper,
  marginDelta,
}: SwapPeripheryParams): Promise<SwapResponse> => {
  return {
    status: 'success',
  };
};
