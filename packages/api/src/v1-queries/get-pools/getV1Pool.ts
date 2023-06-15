import { SupportedChainId } from '@voltz-protocol/commons-v2';
import { V1Pool } from './types';
import { pullExistingPoolRow } from '@voltz-protocol/indexer-v1';
import { buildV1Pool } from './buildV1Pool';

export const getV1Pool = async (
  chainId: SupportedChainId,
  vammAddress: string,
): Promise<V1Pool | null> => {
  const rawPool = await pullExistingPoolRow(vammAddress.toLowerCase(), chainId);

  if (!rawPool) {
    return null;
  }

  return buildV1Pool(rawPool);
};
