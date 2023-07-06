import { API_URL } from './constants';
import { V1V2Pool } from '@voltz-protocol/api-v2-types';

export async function getPoolInfo(ammId: string): Promise<V1V2Pool> {
  const endpoint = `v1v2-pool/${ammId}`;
  const response = await fetch(`${API_URL}${endpoint}`);

  const pool = (await response.json()) as V1V2Pool;
  return pool;
}
