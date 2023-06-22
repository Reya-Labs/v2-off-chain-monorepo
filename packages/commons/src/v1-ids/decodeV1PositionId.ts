import { V1PositionIdData } from './types';

export const decodeV1PositionId = (positionId: string): V1PositionIdData => {
  const parts = positionId.split('_');

  return {
    chainId: Number(parts[0]),
    vammAddress: parts[1],
    ownerAddress: parts[2],
    tickLower: Number(parts[3]),
    tickUpper: Number(parts[4]),
  };
};
