import { Address } from '@voltz-protocol/commons-v2';
import { BaseEvent } from '../common-table-support/baseEvent';
import { mapBaseRow } from '../common-table-support/mapBaseRow';

// state-capturing event
export type AccountCreatedEvent = BaseEvent & {
  accountId: string; // big number
  owner: Address;
};

export const mapRow = (row: any): AccountCreatedEvent => ({
  ...mapBaseRow(row),

  accountId: row.accountId,
  owner: row.owner,
});
