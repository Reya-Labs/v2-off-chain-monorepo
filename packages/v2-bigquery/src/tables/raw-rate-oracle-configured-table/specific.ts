import { Address } from '@voltz-protocol/commons-v2';
import { BaseEvent } from '../../types';
import { mapBaseRow } from '../../utils/raw-events-support/mapBaseRow';

// state-capturing event
export type RateOracleConfiguredEvent = BaseEvent & {
  marketId: string; // big number
  oracleAddress: Address;
  maturityIndexCachingWindowInSeconds: number;
};

export const mapRow = (row: any): RateOracleConfiguredEvent => ({
  ...mapBaseRow(row),

  marketId: row.marketId,
  oracleAddress: row.oracleAddress,
  maturityIndexCachingWindowInSeconds: row.maturityIndexCachingWindowInSeconds,
});
