import { V1PoolIdData } from './types';

// todo: add sanity checks
export const decodeV1PoolId = (poolId: string): V1PoolIdData => {
  const parts = poolId.split('_');

  return {
    chainId: Number(parts[0]),
    vammAddress: parts[1].toLowerCase(),
  };
};
