import { PositionInfo } from './types';
import axios from 'axios';
import { API_URL } from '../urls';
import { V1V2PortfolioPositionDetails } from '@voltz-protocol/api-v2-types';

export const getPositionInfo = async (
  positionId: string,
): Promise<PositionInfo> => {
  const url = `${API_URL}/v1v2-position/${positionId}`;

  const res = await axios.get<V1V2PortfolioPositionDetails>(url, {
    withCredentials: false,
  });

  const portfolioPositionDetails = res.data;

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
