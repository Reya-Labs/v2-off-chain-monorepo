import { API_URL } from '../../constants';
import { V1V2Pool } from '../../types';
import fetch from 'isomorphic-fetch';

export type GetPoolArgs = {
  poolId: string;
};

export async function getPool({ poolId }: GetPoolArgs): Promise<V1V2Pool> {
  const endpoint = `v1v2-pool/${poolId}`;
  const response = await fetch(`${API_URL}/${endpoint}`);

  return (await response.json()) as V1V2Pool;
}
