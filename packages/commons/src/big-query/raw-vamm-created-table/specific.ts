import { Address } from '../../utils/convertLowercase';
import { BaseEvent } from '../../utils/eventTypes';
import { TableType } from '../types';
import { getTableFullName } from '../utils/getTableName';

export type VammCreatedEvent = BaseEvent & {
  marketId: string; // big number
  tick: number;

  // mutable
  priceImpactPhi: number;
  priceImpactBeta: number;
  spread: number;
  rateOracle: Address;

  // immutable
  maxLiquidityPerTick: string; // big number
  tickSpacing: number;
  maturityTimestamp: number;
};

export const tableName = getTableFullName(TableType.raw_vamm_created);

export const mapRow = (row: any): VammCreatedEvent => ({
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
  tick: row.tick,

  priceImpactPhi: row.priceImpactPhi,
  priceImpactBeta: row.priceImpactBeta,
  spread: row.spread,
  rateOracle: row.rateOracle,

  maxLiquidityPerTick: row.maxLiquidityPerTick,
  tickSpacing: row.tickSpacing,
  maturityTimestamp: row.maturityTimestamp,
});
