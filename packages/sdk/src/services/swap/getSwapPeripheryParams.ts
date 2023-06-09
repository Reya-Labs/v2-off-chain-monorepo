/// Gets required information from API and maps it to required action input

import { SwapInfo } from './types';

export async function getSwapPeripheryParams(
  poolId: string,
): Promise<SwapInfo> {
  return {
    productAddress: '0x0000000000000000000000000000000000000000',
    maturityTimestamp: 1675777000,
    marketId: 'mockMarketID',
    quoteTokenAddress: '0x0000000000000000000000000000000000000000',
    currentLiqudityIndex: 1.000000000001283,
  };
}
