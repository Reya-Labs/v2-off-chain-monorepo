import { API_URL } from './constants';
import { V1V2PortfolioPosition } from './types';
import fetch from 'isomorphic-fetch';

export async function getPositions(
  chainIds: number[],
  ownerAddress: string,
): Promise<V1V2PortfolioPosition[]> {
  const endpoint = `v1v2-positions//${chainIds.join('&')}/${ownerAddress}`;

  const response = await fetch(`${API_URL}${endpoint}`);

  const positions = (await response.json()) as V1V2PortfolioPosition[];

  return positions;
}
