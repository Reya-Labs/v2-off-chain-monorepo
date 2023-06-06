import { ProductPositionUpdatedEvent } from '../../utils/eventTypes';
import { bqNumericToNumber } from '../utils/converters';

export const mapToProductPositionUpdatedEvent = (
  row: any,
): ProductPositionUpdatedEvent => ({
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

  accountId: row.accountId,
  marketId: row.marketId,
  maturityTimestamp: row.maturityTimestamp,

  baseDelta: bqNumericToNumber(row.baseDelta),
  quoteDelta: bqNumericToNumber(row.quoteDelta),
});
