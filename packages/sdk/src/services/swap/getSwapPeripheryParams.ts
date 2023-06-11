/// Gets required information from API and maps it to required action input

import { PoolInfo } from './types';

export async function getSwapPeripheryParams(
  poolId: string,
): Promise<PoolInfo> {
  return {
    productAddress: '0x0000000000000000000000000000000000000000',
    maturityTimestamp: 1675777000,
    marketId: 'mockMarketID',
    quoteTokenAddress: '0x0000000000000000000000000000000000000000',
    currentLiquidityIndex: 1.000000000001283,
    currentFixedRate: 3.45,
  };
}
