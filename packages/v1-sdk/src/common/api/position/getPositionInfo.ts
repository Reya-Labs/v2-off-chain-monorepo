import { PortfolioPositionDetails, PositionInfo } from './types';
import axios from 'axios';
import { getServiceUrl } from '../urls';
import { decodePositionId } from './decodePositionId';

export const getPositionInfo = async (
  positionId: string,
): Promise<PositionInfo> => {
  const baseUrl = getServiceUrl('portfolio-position-details');
  const url = `${baseUrl}/${positionId.toLowerCase()}`;

  const res = await axios.get<PortfolioPositionDetails>(url, {
    withCredentials: false,
  });

  const portfolioPositionDetails: PortfolioPositionDetails = res.data;

  const { chainId, tickLower, tickUpper, ownerAddress } = decodePositionId(
    portfolioPositionDetails.id,
  );

  const positionInfo: PositionInfo = {
    positionTickLower: tickLower,
    positionTickUpper: tickUpper,
    ammUnderlyingTokenDecimals:
      portfolioPositionDetails.amm.underlyingToken.tokenDecimals,
    ammMarginEngineAddress: portfolioPositionDetails.amm.marginEngineAddress,
  };

  return positionInfo;
};
