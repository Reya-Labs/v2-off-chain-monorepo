import { decodeV1PoolId, decodeV2PoolId } from '@voltz-protocol/commons-v2';
import { getV1Pool } from '../../v1-queries/get-pools/getV1Pool';
import { getV2Pool } from '../../v2-queries/get-pools/getV2Pool';
import { extendV1Pool } from './extendV1Pool';
import { extendV2Pool } from './extendV2Pool';
import { V1V2Pool } from '@voltz-protocol/api-v2-types';

export const getV1V2Pool = async (poolId: string): Promise<V1V2Pool> => {
  if (poolId.endsWith('v1')) {
    const { chainId, vammAddress } = decodeV1PoolId(poolId);
    const v1Pool = await getV1Pool(chainId, vammAddress);

    if (!v1Pool) {
      throw new Error(`Could not find V1 pool with id ${poolId}`);
    }

    return extendV1Pool(v1Pool);
  }

  if (poolId.endsWith('v2')) {
    const { chainId, marketId, maturityTimestamp } = decodeV2PoolId(poolId);
    const v2Pool = await getV2Pool(chainId, marketId, maturityTimestamp);

    if (!v2Pool) {
      throw new Error(`Could not find V2 pool with id ${poolId}`);
    }

    return extendV2Pool(v2Pool);
  }

  throw new Error(`Could not find V1V2 pool with id ${poolId}`);
};
