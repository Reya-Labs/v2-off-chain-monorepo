import { TableType } from '../types';
import { bqNumericToNumber } from '../utils/converters';
import { getTableFullName } from '../utils/getTableName';

export type PositionEntry = {
  id: string;
  chainId: number;
  accountId: string; // big number
  marketId: string; // big number
  maturityTimestamp: number;
  base: number;
  timeDependentQuote: number;
  freeQuote: number;
  notional: number;
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
  notional?: number;
  lockedFixedRate?: number;
  liquidity?: number;
  paidFees?: number;
};

export const tableName = getTableFullName(TableType.positions);

export const mapRow = (row: any): PositionEntry => ({
  id: row.id,
  chainId: row.chainId,

  accountId: row.accountId,
  marketId: row.marketId,
  maturityTimestamp: row.maturityTimestamp,

  liquidity: bqNumericToNumber(row.liquidityBalance),
  paidFees: bqNumericToNumber(row.paidFees),

  base: bqNumericToNumber(row.base),
  timeDependentQuote: bqNumericToNumber(row.timeDependentQuote),
  freeQuote: bqNumericToNumber(row.freeQuote),
  notional: bqNumericToNumber(row.notional),
  lockedFixedRate: bqNumericToNumber(row.lockedFixedRate),

  type: row.type,
  tickLower: row.tickLower,
  tickUpper: row.tickUpper,
  creationTimestamp: row.creationTimestamp,
});
