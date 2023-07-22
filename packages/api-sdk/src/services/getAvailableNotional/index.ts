import { API_URL } from '../../constants';
import { AvailableNotional } from '../../types';
import fetch from 'isomorphic-fetch';

export type GetAvailableNotionalArgs = {
  poolId: string;
};
export async function getAvailableNotional({
  poolId,
}: GetAvailableNotionalArgs): Promise<AvailableNotional> {
  const endpoint = `v1v2-available-notional/${poolId}`;
  const response = await fetch(`${API_URL}${endpoint}`);

  return (await response.json()) as AvailableNotional;
}
