import { bqNumericToNumber } from '../utils/converters';
import { PositionEntry } from './types';

export const mapToPositionEntry = (row: any): PositionEntry => ({
  id: row.id,
  chainId: row.chainId,

  accountId: row.accountId,
  marketId: row.marketId,
  maturityTimestamp: row.maturityTimestamp,

  baseBalance: bqNumericToNumber(row.baseBalance),
  quoteBalance: bqNumericToNumber(row.quoteBalance),
  notionalBalance: bqNumericToNumber(row.notionalBalance),
  paidFees: bqNumericToNumber(row.paidFees),

  type: row.type,
  tickLower: row.tickLower,
  tickUpper: row.tickUpper,
});
