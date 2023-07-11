import { pullPositionEntryById } from '@voltz-protocol/bigquery-v2';
import { buildV2PortfolioPosition } from './buildV2PortfolioPosition';
import { V2PortfolioPositionDetails } from '@voltz-protocol/api-v2-types';
import { getEnvironmentV2 } from '../../services/envVars';
import { getV2PositionHistory } from './getV2PositionHistory';

export const getV2PortfolioPositionDetails = async ({
  positionId,
  includeHistory,
}: {
  positionId: string;
  includeHistory: boolean;
}): Promise<V2PortfolioPositionDetails> => {
  const positionEntry = await pullPositionEntryById(
    getEnvironmentV2(),
    positionId,
  );

  if (!positionEntry) {
    throw new Error(`Couldn't find v2 position with id ${positionId}`);
  }

  const response = await buildV2PortfolioPosition(positionEntry);

  const history = includeHistory ? await getV2PositionHistory(response) : [];

  return {
    ...response,
    canEdit: true,
    canSettle: false,
    rolloverMaturityTimestamp: null,
    history,
  };
};
