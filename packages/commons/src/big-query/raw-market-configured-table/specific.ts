import { Address } from '../../utils/convertLowercase';
import { BaseEvent } from '../common-table-support/baseEvent';
import { mapBaseRow } from '../common-table-support/mapBaseRow';
import { TableType } from '../types';
import { getTableFullName } from '../utils/getTableName';

// state-capturing event
export type MarketConfiguredEvent = BaseEvent & {
  marketId: string; // big number
  quoteToken: Address;
};

export const tableName = getTableFullName(TableType.raw_market_configured);

export const mapRow = (row: any): MarketConfiguredEvent => ({
  ...mapBaseRow(row),

  marketId: row.marketId,
  quoteToken: row.quoteToken,
});
