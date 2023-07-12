import { pullExistingPoolRow } from '@voltz-protocol/indexer-v1';
import { buildV1Pool } from './buildV1Pool';
import { V1Pool } from '@voltz-protocol/api-v2-types';

export const getV1Pool = async (
  chainId: number,
  vammAddress: string,
): Promise<V1Pool | null> => {
  const rawPool = await pullExistingPoolRow(vammAddress.toLowerCase(), chainId);

  if (!rawPool) {
    return null;
  }

  return buildV1Pool(rawPool);
};
