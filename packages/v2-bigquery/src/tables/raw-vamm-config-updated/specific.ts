import { Address } from '@voltz-protocol/commons-v2';
import { BaseEvent } from '../../types';
import { mapBaseRow } from '../../utils/raw-events-support/mapBaseRow';

export type VammConfigUpdatedEvent = BaseEvent & {
  marketId: string; // big number
  maturityTimestamp: number;

  // mutable
  priceImpactPhi: number;
  priceImpactBeta: number;
  spread: number;
  rateOracle: Address;
  minTick: number;
  maxTick: number;
};

export const mapRow = (row: any): VammConfigUpdatedEvent => ({
  ...mapBaseRow(row),

  marketId: row.marketId,
  maturityTimestamp: row.maturityTimestamp,

  priceImpactPhi: row.priceImpactPhi,
  priceImpactBeta: row.priceImpactBeta,
  spread: row.spread,
  rateOracle: row.rateOracle,

  minTick: row.minTick,
  maxTick: row.maxTick,
});
