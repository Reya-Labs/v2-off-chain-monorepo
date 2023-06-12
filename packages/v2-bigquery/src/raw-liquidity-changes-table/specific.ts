import { Address } from '@voltz-protocol/commons-v2';
import { BaseEvent } from '../common-table-support/baseEvent';
import { mapBaseRow } from '../common-table-support/mapBaseRow';
import { TableType } from '../types';
import { bqNumericToNumber } from '../utils/converters';
import { getTableFullName } from '../utils/getTableName';

export type LiquidityChangeEvent = BaseEvent & {
  accountId: string; // big number

  marketId: string; // big number
  maturityTimestamp: number;
  quoteToken: Address;

  tickLower: number;
  tickUpper: number;
  liquidityDelta: number;
};

export const tableName = getTableFullName(TableType.raw_liquidity_change);

export const mapRow = (row: any): LiquidityChangeEvent => ({
  ...mapBaseRow(row),

  accountId: row.accountId,
  marketId: row.marketId,
  maturityTimestamp: row.maturityTimestamp,
  quoteToken: row.quoteToken,

  tickLower: row.tickLower,
  tickUpper: row.tickUpper,
  liquidityDelta: bqNumericToNumber(row.liquidityDelta),
});
