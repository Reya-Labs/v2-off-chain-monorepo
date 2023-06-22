import { pullPositionEntryById } from '@voltz-protocol/bigquery-v2';
import { V2PortfolioPositionDetails } from './types';
import { buildV2PortfolioPosition } from './buildV2PortfolioPosition';

export const getV2PortfolioPositionDetails = async ({
  positionId,
}: {
  positionId: string;
  includeHistory: boolean;
}): Promise<V2PortfolioPositionDetails> => {
  const positionEntry = await pullPositionEntryById(positionId);

  if (!positionEntry) {
    throw new Error(`Couldn't find v2 position with id ${positionId}`);
  }

  const response = await buildV2PortfolioPosition(positionEntry);

  return {
    ...response,
    canEdit: true,
    canSettle: false,
    rolloverMaturityTimestamp: null,
    history: [],
  };
};
