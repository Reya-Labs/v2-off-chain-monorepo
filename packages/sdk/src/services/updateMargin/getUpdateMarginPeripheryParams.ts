import { scale } from '@voltz-protocol/commons-v2';
import { getPositionInfo } from '../../gateway/getPositionInfo';
import { UpdateMarginInfo } from './types';

export async function getUpdateMarginPeripheryParams(
  positionId: string,
): Promise<UpdateMarginInfo> {
  const positionApiInfo = await getPositionInfo(positionId);
  return {
    productAddress: positionApiInfo.pool.productAddress,
    maturityTimestamp: positionApiInfo.pool.maturityTimestamp,
    marketId: positionApiInfo.pool.marketId,
    quoteTokenAddress: positionApiInfo.pool.quoteToken.address,
    quoteTokenDecimals: positionApiInfo.pool.quoteToken.decimals,
    isETH: positionApiInfo.pool.quoteToken.isEth,
    positionMargin: scale(positionApiInfo.pool.quoteToken.decimals)(positionApiInfo.margin),
    accountId: positionId.split("_")[1]
  };
}
