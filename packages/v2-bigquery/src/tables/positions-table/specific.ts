import { bqNumericToNumber } from '../../utils/converters';

export type PositionEntry = {
  id: string;
  chainId: number;
  accountId: string; // big number
  marketId: string; // big number
  maturityTimestamp: number;
  base: number;
  timeDependentQuote: number;
  freeQuote: number;
  lockedFixedRate: number;
  liquidity: number;
  paidFees: number;
  type: 'trader' | 'lp';
  tickLower: number;
  tickUpper: number;
  creationTimestamp: number;
};

export type PositionEntryUpdate = {
  base?: number;
  timeDependentQuote?: number;
  freeQuote?: number;
  lockedFixedRate?: number;
  liquidity?: number;
  paidFees?: number;
};

export const mapRow = (row: any): PositionEntry => ({
  id: row.id,
  chainId: row.chainId,

  accountId: row.accountId,
  marketId: row.marketId,
  maturityTimestamp: row.maturityTimestamp,

  liquidity: bqNumericToNumber(row.liquidity),
  paidFees: bqNumericToNumber(row.paidFees),

  base: bqNumericToNumber(row.base),
  timeDependentQuote: bqNumericToNumber(row.timeDependentQuote),
  freeQuote: bqNumericToNumber(row.freeQuote),
  lockedFixedRate: bqNumericToNumber(row.lockedFixedRate),

  type: row.type,
  tickLower: row.tickLower,
  tickUpper: row.tickUpper,
  creationTimestamp: row.creationTimestamp,
});
