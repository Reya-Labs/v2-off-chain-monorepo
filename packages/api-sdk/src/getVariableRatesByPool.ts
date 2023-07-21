import { API_URL } from './constants';
import { HistoricalRate } from './types';
import fetch from 'isomorphic-fetch';

export async function getVariableRatesByPool(
  poolId: string,
  startTimestamp: number,
  endTimestamp: number,
): Promise<HistoricalRate[]> {
  const endpoint = `v1v2-variable-rates/${poolId}/${startTimestamp}/${endTimestamp}`;

  const response = await fetch(`${API_URL}${endpoint}`);

  const rates = (await response.json()) as HistoricalRate[];

  return rates;
}
