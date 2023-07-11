import { Address } from '@voltz-protocol/commons-v2';
import { BaseEvent } from '../common-table-support/baseEvent';
import { mapBaseRow } from '../common-table-support/mapBaseRow';
import { bqNumericToNumber } from '../utils/converters';

// action-tracking event
export type DatedIRSPositionSettledEvent = BaseEvent & {
  accountId: string; // big number
  productId: string;
  marketId: string;
  maturityTimestamp: number;
  collateralType: Address;
  settlementCashflowInQuote: number;
};

export const mapRow = (row: any): DatedIRSPositionSettledEvent => ({
  ...mapBaseRow(row),

  accountId: row.accountId,
  productId: row.productId,
  marketId: row.marketId,
  maturityTimestamp: row.maturityTimestamp,
  collateralType: row.collateralType,
  settlementCashflowInQuote: bqNumericToNumber(row.settlementCashflowInQuote),
});
