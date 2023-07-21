import { V1V2PortfolioPositionDetails } from '@voltz-protocol/api-sdk-v2';
import { getV1PortfolioPositionDetails } from '../../v1-queries/get-portfolio-positions/getV1PortfolioPositionDetails';
import { getV2PortfolioPositionDetails } from '../../v2-queries/get-portfolio-positions/getV2PortfolioPositionDetails';
import { extendV1PositionDetails } from './extendV1Position';
import { extendV2PositionDetails } from './extendV2Position';

export const getV1V2PortfolioPositionDetails = async ({
  positionId,
  includeHistory,
}: {
  positionId: string;
  includeHistory: boolean;
}): Promise<V1V2PortfolioPositionDetails> => {
  if (positionId.endsWith('v1')) {
    const v1Position = await getV1PortfolioPositionDetails({
      positionId,
      includeHistory,
    });

    return extendV1PositionDetails(v1Position);
  }

  if (positionId.endsWith('v2')) {
    const v2Position = await getV2PortfolioPositionDetails({
      positionId,
      includeHistory,
    });

    return extendV2PositionDetails(v2Position);
  }

  throw new Error(`Could not find V1V2 position with id ${positionId}`);
};
