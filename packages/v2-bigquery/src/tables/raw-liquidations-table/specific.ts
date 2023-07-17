import { Address } from '@voltz-protocol/commons-v2';
import { BaseEvent } from '../../types';
import { bqNumericToNumber } from '../../utils/converters';
import { mapBaseRow } from '../../utils/raw-events-support/mapBaseRow';

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
