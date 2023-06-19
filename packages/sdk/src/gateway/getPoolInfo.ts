import { API_URL } from './constants';
import { PoolInfo } from './types';

export async function getPoolInfo(
  ammId: string,
  chainId: number,
): Promise<PoolInfo> {
  const endpoint = `/v2-pools/${chainId}`;
  const response = await fetch(`${API_URL}${endpoint}`);

  const pool = ((await response.json()) as any[]).find((p) => p.id === ammId);

  return mapToPoolInfo(pool);
}

export function mapToPoolInfo(pool: any): PoolInfo {
  return {
    productAddress: pool.productAddress,
    maturityTimestamp: Math.round(pool.termEndTimestampInMS / 1000),
    marketId: pool.marketId,
    quoteTokenAddress: pool.underlyingToken.address,
    quoteTokenDecimals: pool.underlyingToken.tokenDecimals,
    isETH: pool.underlyingToken.priceUSD > 1,
    currentLiquidityIndex: pool.currentLiquidityIndex, // e.g. 1.0001
    currentFixedRate: pool.currentFixedRate * 100, // e.g. 3.5 = 3.5%
    chainId: pool.chainId,
  };
}
