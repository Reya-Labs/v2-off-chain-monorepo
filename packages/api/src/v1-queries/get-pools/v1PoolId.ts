import { SupportedChainId } from '@voltz-protocol/commons-v2';

export type V1PoolIdData = {
  chainId: SupportedChainId;
  vammAddress: string;
};

export const encodeV1PoolId = ({
  chainId,
  vammAddress,
}: V1PoolIdData): string => {
  const poolId = `${chainId}_${vammAddress.toLowerCase()}_v1`;

  return poolId;
};

// todo: add sanity checks
export const decodeV1PoolId = (poolId: string): V1PoolIdData => {
  const parts = poolId.split('_');

  return {
    chainId: Number(parts[0]),
    vammAddress: parts[1].toUpperCase(),
  };
};
