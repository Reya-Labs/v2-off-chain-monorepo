import { API_URL } from '../../constants';
import { V1V2PortfolioPositionDetails } from '../../types';
import fetch from 'isomorphic-fetch';

export type GetLpPositionsByPoolArgs = {
  poolId: string;
  ownerAddress: string;
};

export async function getLpPositionsByPool({
  poolId,
  ownerAddress,
}: GetLpPositionsByPoolArgs): Promise<V1V2PortfolioPositionDetails[]> {
  const endpoint = `v1v2-lp-positions-by-pool/${poolId}/${ownerAddress}`;

  const response = await fetch(`${API_URL}${endpoint}`);

  return (await response.json()) as V1V2PortfolioPositionDetails[];
}
