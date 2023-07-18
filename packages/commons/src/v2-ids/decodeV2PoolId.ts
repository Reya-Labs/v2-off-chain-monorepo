import { assert } from '../assert';
import { V2PoolIdData } from './types';

export const decodeV2PoolId = (poolId: string): V2PoolIdData => {
  const parts = poolId.split('_');

  assert(parts.length === 4, `Invalid v2 pool ID: ${poolId}`);

  const chainId = Number(parts[0]);
  const marketId = parts[1];
  const maturityTimestamp = Number(parts[2]);
  const tag = parts[3].toLowerCase();

  assert(
    !isNaN(chainId) && !isNaN(maturityTimestamp) && tag === 'v2',
    `Invalid v2 pool ID ${poolId}`,
  );

  return {
    chainId,
    marketId,
    maturityTimestamp,
  };
};
