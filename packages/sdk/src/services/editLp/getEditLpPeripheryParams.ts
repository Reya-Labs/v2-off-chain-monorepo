/// Gets required information from API and maps it to required action input

import { PositionInfo } from '../editSwap';

export async function getEditLpPeripheryParams(
  poolId: string,
  positionId: string,
): Promise<PositionInfo> {
  return {
    productAddress: '0x0000000000000000000000000000000000000000',
    maturityTimestamp: 1675777000,
    marketId: 'mockMarketID',
    quoteTokenAddress: '0x0000000000000000000000000000000000000000',
    currentLiquidityIndex: 1.000000000001283,
    currentFixedRate: 3.45,
    positionMargin: 10,
    accountId: '218829',
  };
}
