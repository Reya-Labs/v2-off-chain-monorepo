import { LiquidityChangeEvent } from '../../utils/eventTypes';
import { bqNumericToNumber } from '../utils/converters';

export const mapToLiquidityChangeEvent = (row: any): LiquidityChangeEvent => ({
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
  quoteToken: row.quoteToken,

  tickLower: row.tickLower,
  tickUpper: row.tickUpper,
  liquidityDelta: bqNumericToNumber(row.liquidityDelta),
});
