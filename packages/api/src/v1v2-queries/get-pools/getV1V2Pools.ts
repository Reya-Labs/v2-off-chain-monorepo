import { getV2Pools } from '../../v2-queries/get-pools/getV2Pools';
import { getV1Pools } from '../../v1-queries/get-pools/getV1Pools';
import { extendV1Pool } from './extendV1Pool';
import { extendV2Pool } from './extendV2Pool';
import { V1V2Pool } from '@voltz-protocol/api-sdk-v2';

export const getV1V2Pools = async (chainIds: number[]): Promise<V1V2Pool[]> => {
  const response: V1V2Pool[] = [];
  try {
    const v1Pools = await getV1Pools(chainIds);
    response.push(...v1Pools.map(extendV1Pool));
  } catch (_) {}

  try {
    const v2Pools = await getV2Pools(chainIds);
    response.push(...v2Pools.map(extendV2Pool));
  } catch (_) {}

  return response;
};
