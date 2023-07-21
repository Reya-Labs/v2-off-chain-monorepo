import { API_URL } from './constants';
import { V1V2Pool } from './types';
import fetch from 'isomorphic-fetch';

export async function getPool(poolId: string): Promise<V1V2Pool> {
  const endpoint = `v1v2-pool/${poolId}`;
  const response = await fetch(`${API_URL}${endpoint}`);

  const pool = (await response.json()) as V1V2Pool;
  return pool;
}
