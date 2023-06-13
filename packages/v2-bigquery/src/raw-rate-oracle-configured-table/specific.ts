import { Address } from '@voltz-protocol/commons-v2';
import { BaseEvent } from '../common-table-support/baseEvent';
import { mapBaseRow } from '../common-table-support/mapBaseRow';
import { TableType } from '../types';
import { getTableFullName } from '../utils/getTableName';

// state-capturing event
export type RateOracleConfiguredEvent = BaseEvent & {
  marketId: string; // big number
  oracleAddress: Address;
};

export const tableName = getTableFullName(TableType.raw_rate_oracle_configured);

export const mapRow = (row: any): RateOracleConfiguredEvent => ({
  ...mapBaseRow(row),

  marketId: row.marketId,
  oracleAddress: row.oracleAddress,
});
