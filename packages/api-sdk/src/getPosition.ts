import { API_URL } from './constants';
import { V1V2PortfolioPositionDetails } from './types';
import fetch from 'node-fetch';

export async function getPosition(
  positionId: string,
  includeHistory: boolean,
): Promise<V1V2PortfolioPositionDetails> {
  const endpoint = `v1v2-position/${positionId}${
    includeHistory ? '?includeHistory=true' : ''
  }`;
  const response = await fetch(`${API_URL}${endpoint}`);

  const position = (await response.json()) as V1V2PortfolioPositionDetails;

  return position;
}
