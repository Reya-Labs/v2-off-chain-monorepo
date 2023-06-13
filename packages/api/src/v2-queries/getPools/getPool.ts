import { pullVamm } from '@voltz-protocol/bigquery-v2';
import { V2Pool } from './types';
import { buildPool } from './buildPool';
import { SupportedChainId } from '@voltz-protocol/commons-v2';

export const getPool = async (
  chainId: SupportedChainId,
  marketId: string,
  maturityTimestamp: number,
): Promise<V2Pool> => {
  const pool = await pullVamm(chainId, marketId, maturityTimestamp);

  if (!pool) {
    throw new Error(
      `Pool ${chainId}-${marketId}-${maturityTimestamp} was not found.`,
    );
  }

  return buildPool(pool);
};
