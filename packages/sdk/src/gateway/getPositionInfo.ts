import { V1V2PortfolioPositionDetails } from '@voltz-protocol/api-v2-types';
import { API_URL } from './constants';
import { mapToPoolInfo } from './getPoolInfo';
import { PositionInfo } from './types';

export async function getPositionInfo(
  positionId: string,
): Promise<PositionInfo> {
  const endpoint = `v1v2-position/${positionId}`;
  const response = await fetch(`${API_URL}${endpoint}`);

  const position = (await response.json()) as V1V2PortfolioPositionDetails;

  return mapToPositionInfo(position);
}

export function mapToPositionInfo(
  position: V1V2PortfolioPositionDetails,
): PositionInfo {
  return {
    ...mapToPoolInfo(position.pool),

    positionMargin: position.margin,
    accountId: position.accountId,
    tickLower: position.tickLower,
    tickUpper: position.tickUpper,
  };
}
