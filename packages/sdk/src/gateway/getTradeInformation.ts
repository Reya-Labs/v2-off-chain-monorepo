import { V2TradeInformation } from '@voltz-protocol/api-v2-types';
import { API_URL } from './constants';

export async function getTradeInformation(
  poolId: string,
  notional: number,
): Promise<V2TradeInformation> {
  const endpoint = `v1v2-trade-information/${poolId}/${notional}`;
  const response = await fetch(`${API_URL}${endpoint}`);

  const result = (await response.json()) as V2TradeInformation;
  return result;
}
