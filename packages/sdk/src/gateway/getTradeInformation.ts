import { V2TradeInformation } from '@voltz-protocol/api-v2-types';
import { API_URL } from './constants';

export async function getTradeInformation(
  poolId: string,
  base: number,
): Promise<V2TradeInformation> {
  const endpoint = `v2-trade-information/${poolId}/${base}`;
  const response = await fetch(`${API_URL}${endpoint}`);

  const result = (await response.json()) as V2TradeInformation;
  return result;
}
