import { BaseEvent } from '../../utils/eventTypes';
import { TableType } from '../types';
import { bqNumericToNumber } from '../utils/converters';
import { getTableFullName } from '../utils/getTableName';

// state-capturing event
export type ProductPositionUpdatedEvent = BaseEvent & {
  accountId: string; // big number
  marketId: string; // big number
  maturityTimestamp: number;
  baseDelta: number;
  quoteDelta: number;
};

export const tableName = getTableFullName(
  TableType.raw_product_position_updated,
);

export const mapRow = (row: any): ProductPositionUpdatedEvent => ({
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

  baseDelta: bqNumericToNumber(row.baseDelta),
  quoteDelta: bqNumericToNumber(row.quoteDelta),
});
