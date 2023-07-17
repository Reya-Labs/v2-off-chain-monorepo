import { buildV2Pool } from './buildV2Pool';
import { V2Pool } from '@voltz-protocol/api-v2-types';
import { getEnvironmentV2 } from '../../services/envVars';
import { pullIrsVammPool } from '@voltz-protocol/bigquery-v2';
import { encodeV2PoolId } from '@voltz-protocol/commons-v2';

export const getV2Pool = async (
  chainId: number,
  marketId: string,
  maturityTimestamp: number,
): Promise<V2Pool | null> => {
  const poolId = encodeV2PoolId({
    chainId,
    marketId,
    maturityTimestamp,
  });

  const pool = await pullIrsVammPool(getEnvironmentV2(), poolId);

  if (!pool) {
    return null;
  }

  return buildV2Pool(pool);
};
