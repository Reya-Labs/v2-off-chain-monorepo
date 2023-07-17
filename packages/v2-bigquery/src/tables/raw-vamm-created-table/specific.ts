import { Address } from '@voltz-protocol/commons-v2';
import { BaseEvent } from '../../types';
import { mapBaseRow } from '../../utils/raw-events-support/mapBaseRow';

export type VammCreatedEvent = BaseEvent & {
  marketId: string; // big number
  maturityTimestamp: number;

  tick: number;
  maxLiquidityPerTick: string; // big number
  tickSpacing: number;

  priceImpactPhi: number;
  priceImpactBeta: number;

  spread: number;
  rateOracle: Address;

  minTick: number;
  maxTick: number;
};

export const mapRow = (row: any): VammCreatedEvent => ({
  ...mapBaseRow(row),

  marketId: row.marketId,
  maturityTimestamp: row.maturityTimestamp,

  tick: row.tick,
  maxLiquidityPerTick: row.maxLiquidityPerTick,
  tickSpacing: row.tickSpacing,

  priceImpactPhi: row.priceImpactPhi,
  priceImpactBeta: row.priceImpactBeta,

  spread: row.spread,
  rateOracle: row.rateOracle,

  minTick: row.minTick,
  maxTick: row.maxTick,
});
