import { SupportedChainId } from '@voltz-protocol/commons-v2';
import { getV2PortfolioPositions } from '../../v2-queries/get-portfolio-positions/getV2PortfolioPositions';
import { getV1PortfolioPositions } from '../../v1-queries-new/get-portfolio-positions/getV1PortfolioPositions';
import { PortfolioPositionV1V2 } from './types';
import { extendV1Position } from './extendV1Position';
import { extendV2Position } from './extendV2Position';

export const getV1V2PortfolioPositions = async (
  chainIds: SupportedChainId[],
  ownerAddress: string,
): Promise<PortfolioPositionV1V2[]> => {
  const response: PortfolioPositionV1V2[] = [];
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
