import { API_URL } from "./constants";
import { mapToPoolInfo, PoolAPIInfo } from "./getPoolInfo";

export type PositionAPIInfo = {
  pool: PoolAPIInfo,
  positionId: string;
  margin: number;
  notional: string;
  fixedLow: number;
  fixedHigh: number;
}

function mapToPositionInfo(position: any) : PositionAPIInfo {
  return {
    pool: mapToPoolInfo(position.amm),
    positionId: position.id,
    margin: position.margin,
    notional: position.notional,
    fixedLow: position.fixLow,
    fixedHigh: position.fixHigh
  };
}

export async function getPositionInfo(psoitionId: string) : Promise<PositionAPIInfo> {
  const endpoint = `v2-position/${psoitionId}`;
  const response = await fetch(`${API_URL}${endpoint}`);

  return mapToPositionInfo(response);
}
