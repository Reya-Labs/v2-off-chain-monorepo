import { Address } from '../../utils/convertLowercase';
import { BaseEvent } from '../../utils/eventTypes';
import { TableType } from '../types';
import { getTableFullName } from '../utils/getTableName';

// state-capturing event
export type RateOracleConfiguredEvent = BaseEvent & {
  marketId: string; // big number
  oracleAddress: Address;
};

export const tableName = getTableFullName(TableType.raw_rate_oracle_configured);

export const mapRow = (row: any): RateOracleConfiguredEvent => ({
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
  oracleAddress: row.oracleAddress,
});
