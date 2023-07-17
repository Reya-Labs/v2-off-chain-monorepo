import { Address } from '@voltz-protocol/commons-v2';
import { BaseEvent } from '../../types';
import { bqNumericToNumber } from '../../utils/converters';
import { mapBaseRow } from '../../utils/raw-events-support/mapBaseRow';

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
