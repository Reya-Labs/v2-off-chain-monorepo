/// Gets required information from API and maps it to required action input
import { scale } from '@voltz-protocol/commons-v2';
import { getPositionInfo } from '../../gateway/getPositionInfo';
import { SettleInfo } from './types';

export async function getSettlePeripheryParams(
  positionId: string,
): Promise<SettleInfo> {
  const positionApiInfo = await getPositionInfo(positionId);
  return {
    productAddress: positionApiInfo.pool.productAddress,
    maturityTimestamp: positionApiInfo.pool.maturityTimestamp,
    marketId: positionApiInfo.pool.marketId,
    quoteTokenAddress: positionApiInfo.pool.quoteToken.address,
    accountId: positionId.split("_")[1], // todo: make sure this is the accountId
    margin: scale(positionApiInfo.pool.quoteToken.decimals)(positionApiInfo.margin),
  };
}
