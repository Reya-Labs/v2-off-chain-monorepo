import { Address } from '../../utils/convertLowercase';
import { BaseEvent } from '../../utils/eventTypes';
import { TableType } from '../types';
import { bqNumericToNumber } from '../utils/converters';
import { getTableFullName } from '../utils/getTableName';

export type CollateralUpdateEvent = BaseEvent & {
  accountId: string; // big number
  collateralType: Address;
  collateralAmount: number;
  liquidatorBoosterAmount: number;
};

export const tableName = getTableFullName(TableType.raw_collateral_updates);

export const mapRow = (row: any): CollateralUpdateEvent => ({
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
  collateralType: row.collateralType,
  collateralAmount: bqNumericToNumber(row.collateralAmount),
  liquidatorBoosterAmount: bqNumericToNumber(row.liquidatorBoosterAmount),
});
