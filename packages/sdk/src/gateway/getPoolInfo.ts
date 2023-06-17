import { API_URL } from "./constants";

export type PoolAPIInfo = {
  ammId: string;
  chainId: string;
  marketId: string;
  maturityTimestamp: number;
  currentFixedRate: number;
  currentLiquidityIndex: number;
  productAddress: string;
  quoteToken: {
    address: string;
    decimals: number;
    priceUSDC: number;
    isEth: boolean
  };
}

export function mapToPoolInfo(pool: any) : PoolAPIInfo {
  return {
    ammId: pool.id,
    chainId: pool.chainId,
    marketId: pool.marketId,
    maturityTimestamp: Math.round(pool.termEndTimestampInMS / 1000),
    currentFixedRate: pool.currentFixedRate,
    currentLiquidityIndex: pool.currentLiquidityIndex,
    productAddress: pool.productAddress,
    quoteToken: {
      address: pool.underlyingToken.address,
      decimals: pool.underlyingToken.tokenDecimals,
      priceUSDC: pool.underlyingToken.priceUSD,
      isEth: pool.underlyingToken.priceUSD > 1,
    }
  }
}

export async function getPoolInfo(ammId: string) : Promise<PoolAPIInfo> {
  const endpoint = `v2-pool/${ammId}`;
  const response = await fetch(`${API_URL}${endpoint}`);

  return mapToPoolInfo(response);
}
