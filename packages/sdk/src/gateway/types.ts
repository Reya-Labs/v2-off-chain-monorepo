export type PoolConfig = {
  productAddress: string;
  maturityTimestamp: number;
  marketId: string;
  quoteTokenAddress: string;
  quoteTokenDecimals: number;
  isETH: boolean;
  chainId: number;
};

/**
 * @dev Pool information retreived from API
 */
export type PoolInfo = PoolConfig & {
  currentFixedRate: number;
  currentLiquidityIndex: number;
};

/**
 * @dev Position information retreived from API
 */
export type PositionInfo = PoolInfo & {
  positionMargin: number;
  accountId: string;
  tickLower: number;
  tickUpper: number;
};
