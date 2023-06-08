import { Address } from '../../utils/convertLowercase';
import { BaseEvent } from '../common-table-support/baseEvent';
import { mapBaseRow } from '../common-table-support/mapBaseRow';
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
  ...mapBaseRow(row),

  accountId: row.accountId,
  collateralType: row.collateralType,
  collateralAmount: bqNumericToNumber(row.collateralAmount),
  liquidatorBoosterAmount: bqNumericToNumber(row.liquidatorBoosterAmount),
});
