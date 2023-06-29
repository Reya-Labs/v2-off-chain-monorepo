import {
  getPositions as getRawPositions,
  Position as RawPosition,
} from '@voltz-protocol/subgraph-data';

import { getSubgraphURL } from '../subgraph/getSubgraphURL';
import { buildV1PortfolioPosition } from './buildV1PortfolioPosition';
import { V1PortfolioPosition } from '@voltz-protocol/api-v2-types';
import { fetchMultiplePromises } from '@voltz-protocol/commons-v2';

export const getV1PortfolioPositions = async (
  chainIds: number[],
  ownerAddress: string,
): Promise<V1PortfolioPosition[]> => {
  const now = Date.now().valueOf();

  const allPositions: [number, RawPosition][] = [];
  for (const chainId of chainIds) {
    try {
      const subgraphURL = getSubgraphURL(chainId);

      const positions = subgraphURL
        ? await getRawPositions(subgraphURL, now, {
            owners: [ownerAddress],
          })
        : [];

      allPositions.push(
        ...positions.map((p): [number, RawPosition] => [chainId, p]),
      );
    } catch (_) {}
  }

  const positions = await fetchMultiplePromises(
    allPositions.map(([chainId, position]) =>
      buildV1PortfolioPosition(chainId, position, 'light'),
    ),
  );

  positions.sort((a, b) => b.creationTimestampInMS - a.creationTimestampInMS);

  return positions;
};
