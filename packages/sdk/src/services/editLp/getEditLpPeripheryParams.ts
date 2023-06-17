import { getPositionInfo } from '../../gateway/getPositionInfo';
import { PositionInfo } from '../editSwap';

export async function getEditLpPeripheryParams(
  positionId: string,
): Promise<PositionInfo> {
  const positionApiInfo = await getPositionInfo(positionId);
  return {
    productAddress: positionApiInfo.pool.productAddress,
    maturityTimestamp: positionApiInfo.pool.maturityTimestamp,
    marketId: positionApiInfo.pool.marketId,
    quoteTokenAddress: positionApiInfo.pool.quoteToken.address,
    quoteTokenDecimals: positionApiInfo.pool.quoteToken.decimals,
    isETH: positionApiInfo.pool.quoteToken.isEth,
    currentLiquidityIndex: positionApiInfo.pool.currentLiquidityIndex,
    currentFixedRate: positionApiInfo.pool.currentFixedRate,
    positionMargin: positionApiInfo.margin,
    accountId: positionId.split("_")[1],
    fixedRateLower: positionApiInfo.fixedLow,
    fixedRateUpper: positionApiInfo.fixedHigh,
  };
}
