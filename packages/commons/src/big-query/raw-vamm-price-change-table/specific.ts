import { BaseEvent } from '../../utils/eventTypes';
import { TableType } from '../types';
import { getTableFullName } from '../utils/getTableName';

export type VammPriceChangeEvent = BaseEvent & {
  marketId: string; // big number
  maturityTimestamp: number;
  tick: number;
};

export const tableName = getTableFullName(TableType.raw_vamm_price_change);

export const mapRow = (row: any): VammPriceChangeEvent => ({
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

  marketId: row.marketId,
  maturityTimestamp: row.maturityTimestamp,
  tick: row.tick,
});
