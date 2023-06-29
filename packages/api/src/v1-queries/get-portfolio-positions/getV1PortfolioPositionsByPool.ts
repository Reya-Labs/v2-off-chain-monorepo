import { decodeV1PoolId, encodeV1PositionId, fetchMultiplePromises } from '@voltz-protocol/commons-v2';

import { getPositions as getRawPositions } from '@voltz-protocol/subgraph-data';
import { getSubgraphURL } from '../../old-v1-queries/subgraph/getSubgraphURL';
import { getV1PortfolioPositionDetails } from './getV1PortfolioPositionDetails';
import { V1PortfolioPositionDetails } from '@voltz-protocol/api-v2-types';

export const getV1PortfolioPositionsByPool = async (
  poolId: string,
  ownerAddress: string,
  type: 'trader' | 'lp',
): Promise<V1PortfolioPositionDetails[]> => {
  const now = Date.now().valueOf();

  const { chainId, vammAddress } = decodeV1PoolId(poolId);
  const subgraphURL = getSubgraphURL(chainId);
  let positions = subgraphURL
    ? await getRawPositions(subgraphURL, now, {
        owners: [ownerAddress],
        ammIDs: [vammAddress],
      })
    : [];

  if (type === 'trader') {
    positions = positions.filter(
      (p) => p.positionType === 1 || p.positionType === 2,
    );
  } else {
    positions = positions.filter((p) => p.positionType === 3);
  }

  const processedPositions = await fetchMultiplePromises(
    positions.map((p) =>
      getV1PortfolioPositionDetails({
        positionId: encodeV1PositionId({
          chainId,
          vammAddress: p.amm.id,
          ownerAddress: p.owner,
          tickLower: p.tickLower,
          tickUpper: p.tickUpper,
        }),
        includeHistory: true,
      }),
    ),
  );

  return processedPositions;
};
