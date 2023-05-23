import { SwapPeripheryParams } from '../types/actionArgTypes';

export const executeSwap = async ({
  marginEngine,
  isFT,
  notional,
  sqrtPriceLimitX96,
  tickLower,
  tickUpper,
  marginDelta,
}: SwapPeripheryParams): Promise<void> => {
  return {
    status: 'success',
  };
};
