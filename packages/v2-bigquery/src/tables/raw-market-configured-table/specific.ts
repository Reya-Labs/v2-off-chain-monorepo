import { Address } from '@voltz-protocol/commons-v2';
import { BaseEvent } from '../../types';
import { mapBaseRow } from '../../utils/mapBaseRow';

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
