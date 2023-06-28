import { Address } from '@voltz-protocol/commons-v2';
import { BaseEvent } from '../common-table-support/baseEvent';
import { mapBaseRow } from '../common-table-support/mapBaseRow';

// state-capturing event
export type AccountOwnerUpdateEvent = BaseEvent & {
  accountId: string; // big number
  newOwner: Address;
};

export const mapRow = (row: any): AccountOwnerUpdateEvent => ({
  ...mapBaseRow(row),

  accountId: row.accountId,
  newOwner: row.newOwner,
});
