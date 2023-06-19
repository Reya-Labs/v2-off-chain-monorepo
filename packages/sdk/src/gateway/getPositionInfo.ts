import { API_URL } from './constants';
import { mapToPoolInfo } from './getPoolInfo';
import { PositionInfo } from './types';

export async function getPositionInfo(
  positionId: string,
  chainId: number,
  ownerAddress: string,
): Promise<PositionInfo> {
  const endpoint = `v2-positions/${chainId}/${ownerAddress}`;
  const response = await fetch(`${API_URL}${endpoint}`);

  const position = ((await response.json()) as any[]).find(
    (p) => p.id === positionId,
  );

  return mapToPositionInfo(position);
}

export function mapToPositionInfo(position: any): PositionInfo {
  const poolInfo = mapToPoolInfo(position.amm);
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
    accountId: position.id.split('_')[1],
    fixedRateLower: position.type === 'LP' ? position.fixedLow : 0,
    fixedRateUpper: position.type === 'LP' ? position.fixedHigh : 0,
  };
}
