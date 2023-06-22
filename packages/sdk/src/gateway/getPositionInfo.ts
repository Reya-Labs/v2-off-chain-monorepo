import { API_URL } from './constants';
import { mapToPoolInfo } from './getPoolInfo';
import { PositionInfo } from './types';

import { V1V2PortfolioPositionDetails } from '@voltz-protocol/api-v2';

export async function getPositionInfo(
  positionId: string,
): Promise<PositionInfo> {
  const endpoint = `v1v2-position/${positionId}`;
  const response = await fetch(`${API_URL}${endpoint}`);

  const position = (await response.json()) as V1V2PortfolioPositionDetails;

  return mapToPositionInfo(position);
}

export function mapToPositionInfo(
  position: V1V2PortfolioPositionDetails,
): PositionInfo {
  const poolInfo = mapToPoolInfo(position.pool);
  return {
    chainId: poolInfo.chainId,
    productAddress: poolInfo.productAddress,
    maturityTimestamp: poolInfo.maturityTimestamp,
    marketId: poolInfo.marketId,
    quoteTokenAddress: poolInfo.quoteTokenAddress,
    quoteTokenDecimals: poolInfo.quoteTokenDecimals,
    isETH: poolInfo.isETH,
    currentLiquidityIndex: poolInfo.currentLiquidityIndex,
    currentFixedRate: poolInfo.currentFixedRate,
    positionMargin: position.margin,
    accountId: position.accountId,
    fixedRateLower: position.type === 'LP' ? position.fixLow : 0,
    fixedRateUpper: position.type === 'LP' ? position.fixHigh : 0,
  };
}
