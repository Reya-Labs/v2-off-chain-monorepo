import { Address } from '@voltz-protocol/commons-v2';
import { BaseEvent } from '../common-table-support/baseEvent';
import { mapBaseRow } from '../common-table-support/mapBaseRow';
import { bqNumericToNumber } from '../utils/converters';

// action-tracking event
export type DepositedWithdrawnEvent = BaseEvent & {
  accountId: string; // big number
  collateralType: Address;
  tokenAmount: number;
};

export const mapRow = (row: any): DepositedWithdrawnEvent => ({
  ...mapBaseRow(row),

  accountId: row.accountId,
  collateralType: row.collateralType,
  tokenAmount: bqNumericToNumber(row.tokenAmount),
});
