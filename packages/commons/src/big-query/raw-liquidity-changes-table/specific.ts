import { Address } from '../../utils/convertLowercase';
import { BaseEvent } from '../../utils/eventTypes';
import { TableType } from '../types';
import { bqNumericToNumber } from '../utils/converters';
import { getTableFullName } from '../utils/getTableName';

export type LiquidityChangeEvent = BaseEvent & {
  accountId: string; // big number

  marketId: string; // big number
  maturityTimestamp: number;
  quoteToken: Address;

  tickLower: number;
  tickUpper: number;
  liquidityDelta: number;
};

export const tableName = getTableFullName(TableType.raw_liquidity_change);

export const mapRow = (row: any): LiquidityChangeEvent => ({
  id: row.id,
  type: row.type,

  chainId: row.chainId,
  source: row.source,

  blockTimestamp: row.blockTimestamp,
  blockNumber: row.blockNumber,
  blockHash: row.blockHash,

  transactionIndex: row.transactionIndex,
  transactionHash: row.transactionHash,
  logIndex: row.logIndex,

  accountId: row.accountId,
  marketId: row.marketId,
  maturityTimestamp: row.maturityTimestamp,
  quoteToken: row.quoteToken,

  tickLower: row.tickLower,
  tickUpper: row.tickUpper,
  liquidityDelta: bqNumericToNumber(row.liquidityDelta),
});
