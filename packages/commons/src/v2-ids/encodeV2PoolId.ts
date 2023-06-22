import { V2PoolIdData } from './types';

export const encodeV2PoolId = ({
  chainId,
  marketId,
  maturityTimestamp,
}: V2PoolIdData): string => {
  const poolId = `${chainId}_${marketId}_${maturityTimestamp}_v2`;

  return poolId;
};
