export type V2Pool = {
  id: string;
  chainId: number;
  marketId: string;

  creationTimestamp: number;
  maturityTimestamp: number;

  oracleAddress: string;

  currentFixedRate: number;
  fixedRateChange: number;

  currentLiquidityIndex: number;
  currentVariableRate: number;
  variableRateChange: number;
  rateChangeLookbackWindowMS: number;

  tokenName: string;
  tokenAddress: string;
  tokenDecimals: number;
  tokenPriceUSD: number;

  coreAddress: string;
  productAddress: string;
  exchangeAddress: string;
};

export type V2PoolsResult = V2Pool[];
