import { API_URL } from '../../constants';
import { HistoricalRate } from '../../types';
import fetch from 'isomorphic-fetch';

export type GetVariableRatesByPoolArgs = {
  poolId: string;
  startTimestamp: number;
  endTimestamp: number;
};

export async function getVariableRatesByPool({
  poolId,
  startTimestamp,
  endTimestamp,
}: GetVariableRatesByPoolArgs): Promise<HistoricalRate[]> {
  const endpoint = `v1v2-variable-rates/${poolId}/${startTimestamp}/${endTimestamp}`;

  const response = await fetch(`${API_URL}/${endpoint}`);

  return (await response.json()) as HistoricalRate[];
}
