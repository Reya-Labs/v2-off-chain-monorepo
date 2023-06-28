import { getFixedRates as getFixedRatesV1 } from '@voltz-protocol/indexer-v1';
import { decodeV1PoolId, decodeV2PoolId } from '@voltz-protocol/commons-v2';
import { HistoricalRate } from '@voltz-protocol/api-v2-types';

export const getV1V2FixedRates = async (
  poolId: string,
  fromSeconds: number,
  toSeconds: number,
): Promise<HistoricalRate[]> => {
  if (poolId.endsWith('v1')) {
    const { chainId, vammAddress } = decodeV1PoolId(poolId);
    return getFixedRatesV1(chainId, vammAddress, fromSeconds, toSeconds);
  }

  if (poolId.endsWith('v2')) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { chainId, marketId, maturityTimestamp } = decodeV2PoolId(poolId);

    // todo: to be implemented
    return [];
  }

  throw new Error(`Could not find V1V2 pool with id ${poolId}`);
};
