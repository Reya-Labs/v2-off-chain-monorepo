import { Address } from '@voltz-protocol/commons-v2';

export type IrsVammPool = {
  chainId: number;
  marketId: string; // big number
  maturityTimestamp: number;

  rateOracle: Address;
  spread: number;

  priceImpactPhi: number;
  priceImpactBeta: number;

  tickSpacing: number;

  minTick: number;
  maxTick: number;

  currentTick: number;

  creationTimestamp: number;
};

export const mapRow = (row: any): IrsVammPool => ({
  chainId: row.chainId,
  marketId: row.marketId,
  maturityTimestamp: row.maturityTimestamp,

  rateOracle: row.rateOracle,
  spread: row.spread,

  priceImpactPhi: row.priceImpactPhi,
  priceImpactBeta: row.priceImpactBeta,

  tickSpacing: row.tickSpacing,

  minTick: row.minTick,
  maxTick: row.maxTick,

  currentTick: row.currentTick,
  creationTimestamp: row.creationTimestamp,
});
