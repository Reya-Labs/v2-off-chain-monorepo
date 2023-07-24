import { API_URL } from '../../constants';
import { V1V2PortfolioPosition } from '../../types';
import fetch from 'isomorphic-fetch';

export type GetPositionsArgs = {
  chainIds: number[];
  ownerAddress: string;
};

export async function getPositions({
  chainIds,
  ownerAddress,
}: GetPositionsArgs): Promise<V1V2PortfolioPosition[]> {
  const endpoint = `v1v2-positions//${chainIds.join('&')}/${ownerAddress}`;

  const response = await fetch(`${API_URL}/${endpoint}`);

  return (await response.json()) as V1V2PortfolioPosition[];
}
