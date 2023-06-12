import { BaseEvent } from '../common-table-support/baseEvent';
import { mapBaseRow } from '../common-table-support/mapBaseRow';
import { TableType } from '../types';
import { bqNumericToNumber } from '../utils/converters';
import { getTableFullName } from '../utils/getTableName';

// state-capturing event
export type MarketFeeConfiguredEvent = BaseEvent & {
  productId: string; // big number
  marketId: string; // big number
  feeCollectorAccountId: string; // big number
  atomicMakerFee: number;
  atomicTakerFee: number;
};

export const tableName = getTableFullName(TableType.raw_market_fee_configured);

export const mapRow = (row: any): MarketFeeConfiguredEvent => ({
  ...mapBaseRow(row),

  productId: row.productId,
  marketId: row.marketId,
  feeCollectorAccountId: row.feeCollectorAccountId,
  atomicMakerFee: bqNumericToNumber(row.atomicMakerFee),
  atomicTakerFee: bqNumericToNumber(row.atomicTakerFee),
});
