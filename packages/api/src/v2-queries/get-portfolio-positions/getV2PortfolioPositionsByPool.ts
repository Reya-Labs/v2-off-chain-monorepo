import { decodeV2PoolId } from '@voltz-protocol/commons-v2';

import {
  PositionEntry,
  pullAccountPositionEntries,
  pullAccountsByAddress,
} from '@voltz-protocol/bigquery-v2';
import { getV2PortfolioPositionDetails } from './getV2PortfolioPositionDetails';
import { V2PortfolioPositionDetails } from './types';

export const getV2PortfolioPositionsByPool = async (
  poolId: string,
  ownerAddress: string,
  type: 'trader' | 'lp',
): Promise<V2PortfolioPositionDetails[]> => {
  const { chainId, marketId, maturityTimestamp } = decodeV2PoolId(poolId);

  const accounts = await pullAccountsByAddress([chainId], ownerAddress);

  const allPositionEntries: PositionEntry[] = [];

  for (const { chainId, accountId } of accounts) {
    const positionEntries = await pullAccountPositionEntries(
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

  const responses = await Promise.allSettled(
    allPositionEntries.map((p) =>
      getV2PortfolioPositionDetails({
        positionId: p.id,
        includeHistory: true,
      }),
    ),
  );

  const processedPositions = responses.map((r) => {
    if (r.status === 'rejected') {
      throw r.reason;
    }

    return r.value;
  });

  return processedPositions;
};
