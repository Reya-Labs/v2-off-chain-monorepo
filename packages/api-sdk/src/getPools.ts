import { API_URL } from './constants';
import { V1V2Pool } from './types';
import fetch from 'isomorphic-fetch';

export async function getPools(chainIds: number[]): Promise<V1V2Pool[]> {
  const endpoint = `v1v2-pools/${chainIds.join('&')}`;
  const response = await fetch(`${API_URL}${endpoint}`);

  const pools = (await response.json()) as V1V2Pool[];
  return pools;
}
