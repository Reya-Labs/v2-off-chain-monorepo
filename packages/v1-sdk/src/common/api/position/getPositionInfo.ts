import { PositionInfo } from './types';
import { getPosition } from '@voltz-protocol/api-sdk-v2';

export const getPositionInfo = async (
  positionId: string,
): Promise<PositionInfo> => {
  const portfolioPositionDetails = await getPosition(positionId);

  const positionInfo: PositionInfo = {
    chainId: portfolioPositionDetails.pool.chainId,
    positionOwnerAddress: portfolioPositionDetails.ownerAddress,
    isEth: portfolioPositionDetails.pool.underlyingToken.name === 'eth',
    positionTickLower: portfolioPositionDetails.tickLower,
    positionTickUpper: portfolioPositionDetails.tickUpper,
    ammUnderlyingTokenDecimals:
      portfolioPositionDetails.pool.underlyingToken.tokenDecimals,
    ammMarginEngineAddress: portfolioPositionDetails.pool.marginEngineAddress,
    realizedPNLTotal: portfolioPositionDetails.realizedPNLTotal,
    margin: portfolioPositionDetails.margin,
  };

  return positionInfo;
};
