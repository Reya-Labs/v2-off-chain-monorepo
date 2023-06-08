import { TableType } from '../types';
import { bqNumericToNumber } from '../utils/converters';
import { getTableFullName } from '../utils/getTableName';

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

export const tableName = getTableFullName(TableType.positions);

export const mapRow = (row: any): PositionEntry => ({
  id: row.id,
  chainId: row.chainId,

  accountId: row.accountId,
  marketId: row.marketId,
  maturityTimestamp: row.maturityTimestamp,

  baseBalance: bqNumericToNumber(row.baseBalance),
  quoteBalance: bqNumericToNumber(row.quoteBalance),
  notionalBalance: bqNumericToNumber(row.notionalBalance),
  liquidityBalance: bqNumericToNumber(row.notionalBalance),
  paidFees: bqNumericToNumber(row.paidFees),

  type: row.type,
  tickLower: row.tickLower,
  tickUpper: row.tickUpper,
});
