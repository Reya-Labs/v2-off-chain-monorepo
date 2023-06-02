import { VammPriceChangeEvent } from '../../../event-parsers/types';

export const mapToVammPriceChangeEvent = (row: any): VammPriceChangeEvent => ({
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
  maturityTimestamp: row.maturityTimestamp,
  tick: row.tick,
});
