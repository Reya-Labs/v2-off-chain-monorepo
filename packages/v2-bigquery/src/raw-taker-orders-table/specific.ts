import { Address } from '@voltz-protocol/commons-v2';
import { BaseEvent } from '../common-table-support/baseEvent';
import { mapBaseRow } from '../common-table-support/mapBaseRow';
import { bqNumericToNumber } from '../utils/converters';

// action-tracking event
export type TakerOrderEvent = BaseEvent & {
  accountId: string; // big number

  marketId: string; // big number
  maturityTimestamp: number;
  quoteToken: Address;

  executedBaseAmount: number;
  executedQuoteAmount: number;

  annualizedNotionalAmount: number;
};

export const mapRow = (row: any): TakerOrderEvent => ({
  ...mapBaseRow(row),

  accountId: row.accountId,
  marketId: row.marketId,
  maturityTimestamp: row.maturityTimestamp,
  quoteToken: row.quoteToken,

  executedBaseAmount: bqNumericToNumber(row.executedBaseAmount),
  executedQuoteAmount: bqNumericToNumber(row.executedQuoteAmount),

  annualizedNotionalAmount: bqNumericToNumber(row.annualizedNotionalAmount),
});
