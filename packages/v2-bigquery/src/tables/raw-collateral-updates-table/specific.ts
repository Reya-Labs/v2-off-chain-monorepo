import { Address } from '@voltz-protocol/commons-v2';
import { BaseEvent } from '../../types';
import { bqNumericToNumber } from '../../utils/converters';
import { mapBaseRow } from '../../utils/raw-events-support/mapBaseRow';

export type CollateralUpdateEvent = BaseEvent & {
  accountId: string; // big number
  collateralType: Address;
  collateralAmount: number;
  liquidatorBoosterAmount: number;
};

export const mapRow = (row: any): CollateralUpdateEvent => ({
  ...mapBaseRow(row),

  accountId: row.accountId,
  collateralType: row.collateralType,
  collateralAmount: bqNumericToNumber(row.collateralAmount),
  liquidatorBoosterAmount: bqNumericToNumber(row.liquidatorBoosterAmount),
});
