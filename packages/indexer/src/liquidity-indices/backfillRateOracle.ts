import {
  Address,
  SECONDS_IN_DAY,
  getBlockAtTimestamp,
} from '@voltz-protocol/commons-v2';
import { getLiquidityIndexUpdate } from './getLiquidityIndexUpdate';
import { log } from '../logging/log';
import { getProvider } from '../services/getProvider';
import { UpdateBatch, pullLiquidityIndices } from '@voltz-protocol/bigquery-v2';
import { getEnvironmentV2 } from '../services/envVars';

// configuration
const freq = SECONDS_IN_DAY; // frequency in seconds
const lw = 3 * SECONDS_IN_DAY; // look-back window in seconds

export const backfillRateOracle = async (
  chainId: number,
  oracleAddress: Address,
  until: number,
): Promise<UpdateBatch[]> => {
  const provider = getProvider(chainId);

  const isBackfilled =
    (await pullLiquidityIndices(getEnvironmentV2(), chainId, oracleAddress))
      .length > 0;

  if (isBackfilled) {
    return [];
  }

  const timestamps: number[] = [];
  for (let i = until - lw; i <= until; i += freq) {
    timestamps.push(i);
  }

  const responses = await Promise.allSettled(
    timestamps.map(async (ts) => {
      const blockNumber = await getBlockAtTimestamp(provider, ts);
      return getLiquidityIndexUpdate(chainId, oracleAddress, blockNumber, ts);
    }),
  );

  const batches = responses
    .filter((r, i) => {
      if (r.status === 'rejected') {
        log(
          `[Backfilling ${chainId}-${oracleAddress}] Could not add datapoint at ${
            timestamps[i]
          }. (Reason: ${(r.reason as Error).message})`,
        );

        return false;
      }

      return true;
    })
    .map((r) => (r as PromiseFulfilledResult<UpdateBatch>).value);

  return batches;
};
