/// Gets required information from API and maps it to required action input

import { SettleParametersResult } from './types';

export async function getSettlePeripheryParams(
  positionId: string,
): Promise<SettleParametersResult> {
  return {
    productAddress: '0x0000000000000000000000000000000000000000',
    maturityTimestamp: 1675777000,
    marketId: 'mockMarketID',
    quoteTokenAddress: '0x0000000000000000000000000000000000000000',
    accountId: '128636',
    marginAmount: 100,
  };
}
