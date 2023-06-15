import { SupportedChainId } from '@voltz-protocol/commons-v2';
import { V1Pool } from './types';
import { pullExistingPoolRow } from '@voltz-protocol/indexer-v1';
import { buildPool } from './buildPool';

export const getPool = async (
  chainId: SupportedChainId,
  vammAddress: string,
): Promise<V1Pool | null> => {
  const rawPool = await pullExistingPoolRow(vammAddress.toLowerCase(), chainId);

  if (!rawPool) {
    return null;
  }

  return buildPool(rawPool);
};
