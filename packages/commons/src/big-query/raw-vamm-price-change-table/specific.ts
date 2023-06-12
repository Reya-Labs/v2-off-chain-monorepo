import { BaseEvent } from '../common-table-support/baseEvent';
import { mapBaseRow } from '../common-table-support/mapBaseRow';
import { TableType } from '../types';
import { getTableFullName } from '../utils/getTableName';

export type VammPriceChangeEvent = BaseEvent & {
  marketId: string; // big number
  maturityTimestamp: number;
  tick: number;
};

export const tableName = getTableFullName(TableType.raw_vamm_price_change);

export const mapRow = (row: any): VammPriceChangeEvent => ({
  ...mapBaseRow(row),

  marketId: row.marketId,
  maturityTimestamp: row.maturityTimestamp,
  tick: row.tick,
});
