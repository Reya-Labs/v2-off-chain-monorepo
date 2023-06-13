import { SupportedChainId } from '@voltz-protocol/commons-v2';

export type V2PoolIdData = {
  chainId: SupportedChainId;
  marketId: string;
  maturityTimestamp: number;
};

export const encodeV2PoolId = ({
  chainId,
  marketId,
  maturityTimestamp,
}: V2PoolIdData): string => {
  const poolId = `${chainId}_${marketId}_${maturityTimestamp}_v2`;

  return poolId;
};

// todo: add sanity checks
export const decodeV2PoolId = (poolId: string): V2PoolIdData => {
  const parts = poolId.split('_');

  return {
    chainId: Number(parts[0]),
    marketId: parts[1],
    maturityTimestamp: Number(parts[2]),
  };
};
