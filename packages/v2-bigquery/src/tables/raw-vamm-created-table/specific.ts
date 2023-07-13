import { Address } from '@voltz-protocol/commons-v2';
import { BaseEvent } from '../../types';
import { mapBaseRow } from '../../utils/mapBaseRow';

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

export const mapRow = (row: any): VammCreatedEvent => ({
  ...mapBaseRow(row),

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
