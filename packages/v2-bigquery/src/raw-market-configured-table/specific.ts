import { Address } from '@voltz-protocol/commons-v2';
import { BaseEvent } from '../common-table-support/baseEvent';
import { mapBaseRow } from '../common-table-support/mapBaseRow';

// state-capturing event
export type MarketConfiguredEvent = BaseEvent & {
  marketId: string; // big number
  quoteToken: Address;
};

export const mapRow = (row: any): MarketConfiguredEvent => ({
  ...mapBaseRow(row),

  marketId: row.marketId,
  quoteToken: row.quoteToken,
});
