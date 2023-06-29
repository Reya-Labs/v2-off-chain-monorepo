import { pullVamm } from '@voltz-protocol/bigquery-v2';
import { buildV2Pool } from './buildV2Pool';
import { SupportedChainId } from '@voltz-protocol/commons-v2';
import { V2Pool } from '@voltz-protocol/api-v2-types';
import { getEnvironmentV2 } from '../../services/envVars';

export const getV2Pool = async (
  chainId: SupportedChainId,
  marketId: string,
  maturityTimestamp: number,
): Promise<V2Pool | null> => {
  const pool = await pullVamm(
    getEnvironmentV2(),
    chainId,
    marketId,
    maturityTimestamp,
  );

  if (!pool) {
    return null;
  }

  return buildV2Pool(pool);
};
