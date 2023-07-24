import { API_URL } from '../../constants';
import { V1V2PortfolioPositionDetails } from '../../types';
import fetch from 'isomorphic-fetch';

export type GetTraderPositionByPoolArgs = {
  poolId: string;
  ownerAddress: string;
};

export async function getTraderPositionByPool({
  poolId,
  ownerAddress,
}: GetTraderPositionByPoolArgs): Promise<V1V2PortfolioPositionDetails | null> {
  const endpoint = `v1v2-trader-positions-by-pool/${poolId}/${ownerAddress}`;

  const response = await fetch(`${API_URL}/${endpoint}`);

  const positions = (await response.json()) as V1V2PortfolioPositionDetails[];

  if (positions.length === 0) {
    return null;
  }

  return positions[0];
}
