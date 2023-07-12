import {
  decodeV2PoolId,
  fetchMultiplePromises,
} from '@voltz-protocol/commons-v2';

import {
  PositionEntry,
  pullAccountPositionEntries,
  pullAccountsByAddress,
} from '@voltz-protocol/bigquery-v2';
import { getV2PortfolioPositionDetails } from './getV2PortfolioPositionDetails';
import { V2PortfolioPositionDetails } from '@voltz-protocol/api-v2-types';
import { getEnvironmentV2 } from '../../services/envVars';

export const getV2PortfolioPositionsByPool = async (
  poolId: string,
  ownerAddress: string,
  type: 'trader' | 'lp',
): Promise<V2PortfolioPositionDetails[]> => {
  const { chainId, marketId, maturityTimestamp } = decodeV2PoolId(poolId);

  const accounts = await pullAccountsByAddress(
    getEnvironmentV2(),
    [chainId],
    ownerAddress,
  );

  const allPositionEntries: PositionEntry[] = [];

  for (const { chainId, accountId } of accounts) {
    const positionEntries = await pullAccountPositionEntries(
      getEnvironmentV2(),
      chainId,
      accountId,
    );

    allPositionEntries.push(
      ...positionEntries.filter(
        (p) =>
          p.marketId === marketId &&
          p.maturityTimestamp === maturityTimestamp &&
          p.type === type,
      ),
    );
  }

  const { data: processedPositions } = await fetchMultiplePromises(
    allPositionEntries.map((p) =>
      getV2PortfolioPositionDetails({
        positionId: p.id,
        includeHistory: true,
      }),
    ),
  );

  return processedPositions;
};
