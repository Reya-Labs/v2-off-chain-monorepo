import { Address } from '../../utils/convertLowercase';
import { BaseEvent } from '../common-table-support/baseEvent';
import { mapBaseRow } from '../common-table-support/mapBaseRow';
import { TableType } from '../types';
import { getTableFullName } from '../utils/getTableName';

// state-capturing event
export type AccountCreatedEvent = BaseEvent & {
  accountId: string; // big number
  owner: Address;
};

export const tableName = getTableFullName(TableType.raw_account_created);

export const mapRow = (row: any): AccountCreatedEvent => ({
  ...mapBaseRow(row),

  accountId: row.accountId,
  owner: row.owner,
});
