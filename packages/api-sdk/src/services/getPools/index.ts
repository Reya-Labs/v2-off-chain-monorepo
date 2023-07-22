import { API_URL } from '../../constants';
import { V1V2Pool } from '../../types';
import fetch from 'isomorphic-fetch';

export type GetPoolsArgs = {
  chainIds: number[];
};

export async function getPools({
  chainIds,
}: GetPoolsArgs): Promise<V1V2Pool[]> {
  const endpoint = `v1v2-pools/${chainIds.join('&')}`;
  const response = await fetch(`${API_URL}${endpoint}`);

  return (await response.json()) as V1V2Pool[];
}
