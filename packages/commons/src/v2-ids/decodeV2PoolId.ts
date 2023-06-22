import { V2PoolIdData } from './types';

// todo: add sanity checks
export const decodeV2PoolId = (poolId: string): V2PoolIdData => {
  const parts = poolId.split('_');

  return {
    chainId: Number(parts[0]),
    marketId: parts[1],
    maturityTimestamp: Number(parts[2]),
  };
};
