import { API_URL } from './constants';
import { V1V2PortfolioPositionDetails } from './types';
import fetch from 'isomorphic-fetch';

export async function getLpPositionsByPool(
  poolId: string,
  ownerAddress: string,
): Promise<V1V2PortfolioPositionDetails[]> {
  const endpoint = `v1v2-lp-positions-by-pool/${poolId}/${ownerAddress}`;

  const response = await fetch(`${API_URL}${endpoint}`);

  const positions = (await response.json()) as V1V2PortfolioPositionDetails[];

  return positions;
}
