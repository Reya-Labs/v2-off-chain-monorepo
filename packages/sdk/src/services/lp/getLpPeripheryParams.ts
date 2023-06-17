import { getPoolInfo } from '../../gateway/getPoolInfo';
import { PoolInfo } from '../swap';

export async function getLpPeripheryParams(poolId: string): Promise<PoolInfo> {
  const poolApiInfo = await getPoolInfo(poolId);
  return {
    productAddress: poolApiInfo.productAddress,
    maturityTimestamp: poolApiInfo.maturityTimestamp,
    marketId: poolApiInfo.marketId,
    quoteTokenAddress: poolApiInfo.quoteToken.address,
    quoteTokenDecimals: poolApiInfo.quoteToken.decimals,
    currentLiquidityIndex: poolApiInfo.currentLiquidityIndex, // e.g. 1.0001
    currentFixedRate: poolApiInfo.currentFixedRate, // e.g. 3.5 = 3.5%
  };
}
