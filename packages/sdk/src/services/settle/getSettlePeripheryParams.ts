/// Gets required information from API and maps it to required action input
import { BigNumber } from 'ethers';
import { SettleInfo } from './types';

export async function getSettlePeripheryParams(
  positionId: string,
): Promise<SettleInfo> {
  return {
    productAddress: '0x0000000000000000000000000000000000000000',
    maturityTimestamp: 1675777000,
    marketId: 'mockMarketID',
    quoteTokenAddress: '0x0000000000000000000000000000000000000000',
    accountId: '128636',
    marginAmount: BigNumber.from(100),
  };
}
