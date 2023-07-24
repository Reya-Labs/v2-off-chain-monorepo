import { API_URL } from '../../constants';
import { HistoricalRate } from '../../types';
import fetch from 'isomorphic-fetch';

export type GetFixedRatesByPoolArgs = {
  poolId: string;
  startTimestamp: number;
  endTimestamp: number;
};

export async function getFixedRatesByPool({
  poolId,
  startTimestamp,
  endTimestamp,
}: GetFixedRatesByPoolArgs): Promise<HistoricalRate[]> {
  const endpoint = `v1v2-fixed-rates/${poolId}/${startTimestamp}/${endTimestamp}`;

  const response = await fetch(`${API_URL}/${endpoint}`);

  return (await response.json()) as HistoricalRate[];
}
