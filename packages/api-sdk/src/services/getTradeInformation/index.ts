import { API_URL } from '../../constants';
import { V2TradeInformation } from '../../types';
import fetch from 'isomorphic-fetch';

export type GetTradeInformationArgs = {
  poolId: string;
  base: number;
};

export async function getTradeInformation({
  poolId,
  base,
}: GetTradeInformationArgs): Promise<V2TradeInformation> {
  const endpoint = `v2-trade-information/${poolId}/${base}`;
  const response = await fetch(`${API_URL}/${endpoint}`);

  return (await response.json()) as V2TradeInformation;
}
