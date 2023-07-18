import { V1PositionIdData } from './types';

export const encodeV1PositionId = ({
  chainId,
  vammAddress,
  ownerAddress,
  tickLower,
  tickUpper,
}: V1PositionIdData): string => {
  return `${chainId}_${vammAddress}_${ownerAddress}_${tickLower}_${tickUpper}_v1`;
};
