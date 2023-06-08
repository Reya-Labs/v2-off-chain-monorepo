import { Address } from '../../utils/convertLowercase';
import { BaseEvent } from '../../utils/eventTypes';
import { TableType } from '../types';
import { getTableFullName } from '../utils/getTableName';

// state-capturing event
export type MarketConfiguredEvent = BaseEvent & {
  marketId: string; // big number
  quoteToken: Address;
};

export const tableName = getTableFullName(TableType.raw_market_configured);

export const mapRow = (row: any): MarketConfiguredEvent => ({
  id: row.id,
  type: row.type,

  chainId: row.chainId,
  source: row.source,

  blockTimestamp: row.blockTimestamp,
  blockNumber: row.blockNumber,
  blockHash: row.blockHash,

  transactionIndex: row.transactionIndex,
  transactionHash: row.transactionHash,
  logIndex: row.logIndex,

  marketId: row.marketId,
  quoteToken: row.quoteToken,
});
