/// Gets required information from API and maps it to required action input
import { BigNumber } from 'ethers';
import { UpdateMarginInfo } from './types';

export async function getUpdateMarginPeripheryParams(
  positionId: string,
): Promise<UpdateMarginInfo> {
  return {
    productAddress: '0x0000000000000000000000000000000000000000',
    maturityTimestamp: 1675777000,
    marketId: 'mockMarketID',
    quoteTokenAddress: '0x0000000000000000000000000000000000000000',
    accountId: '128636',
    positionMarginAmount: BigNumber.from(100),
  };
}
