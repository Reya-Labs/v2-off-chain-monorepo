import { API_URL } from '../../constants';
import { V1V2PortfolioPositionDetails } from '../../types';
import fetch from 'isomorphic-fetch';

export type GetPositionArgs = {
  positionId: string;
  includeHistory: boolean;
};

export async function getPosition({
  positionId,
  includeHistory,
}: GetPositionArgs): Promise<V1V2PortfolioPositionDetails> {
  const endpoint = `v1v2-position/${positionId}${
    includeHistory ? '?includeHistory=true' : ''
  }`;
  const response = await fetch(`${API_URL}${endpoint}`);

  return (await response.json()) as V1V2PortfolioPositionDetails;
}
