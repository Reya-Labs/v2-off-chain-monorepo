import { Address } from '@voltz-protocol/commons-v2';
import { BaseEvent } from '../../types';
import { mapBaseRow } from '../../utils/raw-events-support/mapBaseRow';

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
