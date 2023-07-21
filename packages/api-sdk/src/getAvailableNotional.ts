import { API_URL } from './constants';
import { AvailableNotional } from './types';
import fetch from 'node-fetch';

export async function getAvailableNotional(
  poolId: string,
): Promise<AvailableNotional> {
  const endpoint = `v1v2-available-notional/${poolId}`;
  const response = await fetch(`${API_URL}${endpoint}`);

  const result = (await response.json()) as AvailableNotional;
  return result;
}
