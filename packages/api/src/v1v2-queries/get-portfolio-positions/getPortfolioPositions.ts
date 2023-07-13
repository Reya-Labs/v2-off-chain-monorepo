import { getV2PortfolioPositions } from '../../v2-queries/get-portfolio-positions/getV2PortfolioPositions';
import { getV1PortfolioPositions } from '../../v1-queries/get-portfolio-positions/getV1PortfolioPositions';
import { extendV1Position } from './extendV1Position';
import { extendV2Position } from './extendV2Position';
import { V1V2PortfolioPosition } from '@voltz-protocol/api-v2-types';

export const getV1V2PortfolioPositions = async (
  chainIds: number[],
  ownerAddress: string,
): Promise<V1V2PortfolioPosition[]> => {
  const response: V1V2PortfolioPosition[] = [];
  try {
    const v1Positions = await getV1PortfolioPositions(chainIds, ownerAddress);
    response.push(...v1Positions.map(extendV1Position));
  } catch (_) {}

  try {
    const v2Positions = await getV2PortfolioPositions(chainIds, ownerAddress);
    response.push(...v2Positions.map(extendV2Position));
  } catch (_) {}

  return response;
};
