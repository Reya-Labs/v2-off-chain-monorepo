import { V1V2PortfolioPositionDetails } from '@voltz-protocol/api-v2-types';
import { API_URL } from './constants';

export async function getPositionInfo(
  positionId: string,
): Promise<V1V2PortfolioPositionDetails> {
  const endpoint = `v1v2-position/${positionId}`;
  const response = await fetch(`${API_URL}${endpoint}`);

  const position = (await response.json()) as V1V2PortfolioPositionDetails;

  return position;
}
