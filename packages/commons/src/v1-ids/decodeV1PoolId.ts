import { convertToAddress } from '../address';
import { assert } from '../assert';
import { V1PoolIdData } from './types';

export const decodeV1PoolId = (poolId: string): V1PoolIdData => {
  const parts = poolId.split('_');

  assert(parts.length === 3, `Invalid v1 pool ID: ${poolId}`);

  const chainId = Number(parts[0]);
  const vammAddress = convertToAddress(parts[1]);
  const tag = parts[2].toLowerCase();

  assert(!isNaN(chainId) && tag === 'v1', `Invalid v1 pool ID ${poolId}`);

  return {
    chainId,
    vammAddress,
  };
};
