import { VammCreatedEvent } from '../../../event-parsers/types';

export const mapToVammCreatedEvent = (row: any): VammCreatedEvent => ({
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

  priceImpactPhi: row.priceImpactPhi,
  priceImpactBeta: row.priceImpactBeta,
  spread: row.spread,
  rateOracle: row.rateOracle,

  maxLiquidityPerTick: row.maxLiquidityPerTick,
  tickSpacing: row.tickSpacing,
  maturityTimestamp: row.maturityTimestamp,
});