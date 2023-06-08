import { Address } from '../../utils/convertLowercase';
import { BaseEvent } from '../common-table-support/baseEvent';
import { mapBaseRow } from '../common-table-support/mapBaseRow';
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
