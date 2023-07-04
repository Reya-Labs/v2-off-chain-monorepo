import { getFixedRates as getFixedRatesV1 } from '@voltz-protocol/indexer-v1';
import { decodeV1PoolId } from '@voltz-protocol/commons-v2';
import { HistoricalRate } from '@voltz-protocol/api-v2-types';

export const getV1V2FixedRates = async (
  poolId: string,
  fromSeconds: number,
  toSeconds: number,
): Promise<HistoricalRate[]> => {
  if (poolId.endsWith('v1')) {
    try {
      const { chainId, vammAddress } = decodeV1PoolId(poolId);
      const fixedRates = await getFixedRatesV1(
        chainId,
        vammAddress,
        fromSeconds,
        toSeconds,
      );
      return fixedRates;
    } catch (error) {
      console.error(`Unable to fetch fixed rates for V1 pool ${poolId}`);
      return [];
    }
  }

  if (poolId.endsWith('v2')) {
    try {
      return [];
    } catch (error) {
      console.error(`Unable to fetch fixed rates for V2 pool ${poolId}`);
      return [];
    }
  }

  console.error(`Could not find V1V2 pool with id ${poolId}`);
  return [];
};
