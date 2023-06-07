export type PositionEntry = {
  id: string;
  chainId: number;
  accountId: string; // big number
  marketId: string; // big number
  maturityTimestamp: number;
  baseBalance: number;
  quoteBalance: number;
  notionalBalance: number; // for PnL
  liquidityBalance: number;
  paidFees: number;
  type: 'trader' | 'lp';
  tickLower: number;
  tickUpper: number;
};

export type PositionEntryUpdate = {
  baseBalance?: number;
  quoteBalance?: number;
  notionalBalance?: number; // for PnL
  liquidityBalance?: number;
  paidFees?: number;
};
