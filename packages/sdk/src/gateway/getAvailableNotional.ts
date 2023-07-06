import { AvailableNotional } from '@voltz-protocol/api-v2-types';
import { API_URL } from './constants';

export async function getAvailableNotional(
  poolId: string,
): Promise<AvailableNotional> {
  const endpoint = `v1v2-available-notional/${poolId}`;
  const response = await fetch(`${API_URL}${endpoint}`);

  const result = (await response.json()) as AvailableNotional;
  return result;
}
