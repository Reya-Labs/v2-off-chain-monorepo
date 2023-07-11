import { Address } from '@voltz-protocol/commons-v2';
import { BaseEvent } from '../common-table-support/baseEvent';
import { mapBaseRow } from '../common-table-support/mapBaseRow';
import { bqNumericToNumber } from '../utils/converters';

// action-tracking event
export type LiquidationEvent = BaseEvent & {
  liquidatedAccountId: string; // big number
  collateralType: Address;
  sender: Address;
  liquidatorAccountId: string; // big number
  liquidatorRewardAmount: number;
  imPreClose: number;
  imPostClose: number;
};

export const mapRow = (row: any): LiquidationEvent => ({
  ...mapBaseRow(row),

  liquidatedAccountId: row.liquidatedAccountId,
  collateralType: row.collateralType,
  sender: row.sender,
  liquidatorAccountId: row.liquidatorAccountId,

  liquidatorRewardAmount: bqNumericToNumber(row.liquidatorRewardAmount),
  imPreClose: bqNumericToNumber(row.imPreClose),
  imPostClose: bqNumericToNumber(row.imPostClose),
});
