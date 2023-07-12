export type V2PoolIdData = {
  chainId: number;
  marketId: string;
  maturityTimestamp: number;
};

export type V2PositionIdData = {
  chainId: number;
  accountId: string;
  marketId: string;
  maturityTimestamp: number;
  type: 'trader' | 'lp';

  tickLower?: number;
  tickUpper?: number;
};
