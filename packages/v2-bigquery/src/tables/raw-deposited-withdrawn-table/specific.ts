import { Address } from '@voltz-protocol/commons-v2';
import { BaseEvent } from '../../types';
import { bqNumericToNumber } from '../../utils/converters';
import { mapBaseRow } from '../../utils/raw-events-support/mapBaseRow';

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
