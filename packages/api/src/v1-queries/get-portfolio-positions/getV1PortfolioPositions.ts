import {
  getPositions as getRawPositions,
  Position as RawPosition,
} from '@voltz-protocol/subgraph-data';

import { V1PortfolioPosition } from './types';
import { getSubgraphURL } from '../subgraph/getSubgraphURL';
import { buildV1PortfolioPosition } from './buildV1PortfolioPosition';

export const getV1PortfolioPositions = async (
  chainIds: number[],
  ownerAddress: string,
): Promise<V1PortfolioPosition[]> => {
  const now = Date.now().valueOf();

  const allPositions: [number, RawPosition][] = [];
  for (const chainId of chainIds) {
    const subgraphURL = getSubgraphURL(chainId);
    const positions = subgraphURL
      ? await getRawPositions(subgraphURL, now, {
          owners: [ownerAddress],
        })
      : [];

    allPositions.push(
      ...positions.map((p): [number, RawPosition] => [chainId, p]),
    );
  }

  const responses = await Promise.allSettled(
    allPositions.map(([chainId, position]) =>
      buildV1PortfolioPosition(chainId, position, 'light'),
    ),
  );

  const positions = responses.map((resp) => {
    if (resp.status === 'fulfilled') {
      return resp.value;
    }
    throw new Error(
      `Promise rejected with error: ${(resp.reason as Error).message}`,
    );
  });

  positions.sort((a, b) => b.creationTimestampInMS - a.creationTimestampInMS);

  return positions;
};
