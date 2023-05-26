import { MarketFeeConfiguredEvent } from '../../../event-parsers/types';
import { bqNumericToNumber } from '../utils/converters';

export const mapToMarketFeeConfiguredEvent = (
  row: any,
): MarketFeeConfiguredEvent => ({
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

  productId: row.productId,
  marketId: row.marketId,
  feeCollectorAccountId: row.feeCollectorAccountId,
  atomicMakerFee: bqNumericToNumber(row.atomicMakerFee),
  atomicTakerFee: bqNumericToNumber(row.atomicTakerFee),
});
