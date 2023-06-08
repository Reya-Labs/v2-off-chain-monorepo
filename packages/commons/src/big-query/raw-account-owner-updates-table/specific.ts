import { Address } from '../../utils/convertLowercase';
import { BaseEvent } from '../../utils/eventTypes';
import { TableType } from '../types';
import { getTableFullName } from '../utils/getTableName';

// state-capturing event
export type AccountOwnerUpdateEvent = BaseEvent & {
  accountId: string; // big number
  newOwner: Address;
};

export const tableName = getTableFullName(TableType.raw_account_owner_updates);

export const mapRow = (row: any): AccountOwnerUpdateEvent => ({
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
  newOwner: row.newOwner,
});
