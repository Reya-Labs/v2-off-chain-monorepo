import { V1PositionIdData } from './types';

export const encodeV1PositionId = ({
  chainId,
  vammAddress,
  ownerAddress,
  tickLower,
  tickUpper,
}: V1PositionIdData): string => {
  return `${chainId}_${vammAddress.toLowerCase()}_${ownerAddress.toLowerCase()}_${tickLower}_${tickUpper}`;
};
