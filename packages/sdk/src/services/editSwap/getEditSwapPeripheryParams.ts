/// Gets required information from API and maps it to required action input
import { PositionInfo } from './types';
import { getPositionInfo } from '../../gateway/getPositionInfo';

export async function getEditSwapPeripheryParams(
  positionId: string,
): Promise<PositionInfo> {
  const positionApiInfo = await getPositionInfo(positionId);
  return {
    productAddress: positionApiInfo.pool.productAddress,
    maturityTimestamp: positionApiInfo.pool.maturityTimestamp,
    marketId: positionApiInfo.pool.marketId,
    quoteTokenAddress: positionApiInfo.pool.quoteToken.address,
    quoteTokenDecimals: positionApiInfo.pool.quoteToken.decimals,
    currentLiquidityIndex: positionApiInfo.pool.currentLiquidityIndex,
    currentFixedRate: positionApiInfo.pool.currentFixedRate,
    positionMargin: positionApiInfo.margin,
    accountId: positionId.split("_")[1],
    fixedRateLower: 0,
    fixedRateUpper: 0
  };
}
