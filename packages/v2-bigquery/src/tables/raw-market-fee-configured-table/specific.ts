import { BaseEvent } from '../../types';
import { bqNumericToNumber } from '../../utils/converters';
import { mapBaseRow } from '../../utils/mapBaseRow';

// state-capturing event
export type MarketFeeConfiguredEvent = BaseEvent & {
  productId: string; // big number
  marketId: string; // big number
  feeCollectorAccountId: string; // big number
  atomicMakerFee: number;
  atomicTakerFee: number;
};

export const mapRow = (row: any): MarketFeeConfiguredEvent => ({
  ...mapBaseRow(row),

  productId: row.productId,
  marketId: row.marketId,
  feeCollectorAccountId: row.feeCollectorAccountId,
  atomicMakerFee: bqNumericToNumber(row.atomicMakerFee),
  atomicTakerFee: bqNumericToNumber(row.atomicTakerFee),
});
