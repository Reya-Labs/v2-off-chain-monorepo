import { V1V2PortfolioPositionDetails } from './types';
import { extendV1PositionDetails } from './extendV1Position';
import { extendV2PositionDetails } from './extendV2Position';
import { getV1PortfolioPositionsByPool } from '../../v1-queries/get-portfolio-positions/getV1PortfolioPositionsByPool';
import { getV2PortfolioPositionsByPool } from '../../v2-queries/get-portfolio-positions/getV2PortfolioPositionsByPool';

export const getV1V2PortfolioPositionsByPool = async (
  poolId: string,
  ownerAddress: string,
  type: 'trader' | 'lp',
): Promise<V1V2PortfolioPositionDetails[]> => {
  if (poolId.endsWith('v1')) {
    const positions = await getV1PortfolioPositionsByPool(
      poolId,
      ownerAddress,
      type,
    );

    return positions.map((p) => extendV1PositionDetails(p));
  }

  if (poolId.endsWith('v2')) {
    const positions = await getV2PortfolioPositionsByPool(
      poolId,
      ownerAddress,
      type,
    );

    return positions.map((p) => extendV2PositionDetails(p));
  }

  return [];
};
