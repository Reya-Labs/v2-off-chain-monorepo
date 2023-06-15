import { V1V2Pool } from './types';
import { SupportedChainId } from '@voltz-protocol/commons-v2';
import { getPools as getV2Pools } from '../../v2-queries/get-pools/getPools';
import { getPools as getV1Pools } from '../../v1-queries-new/get-pools/getPools';
import { extendV1Pool } from './extendV1Pool';
import { extendV2Pool } from './extendV2Pool';

export const getPools = async (
  chainIds: SupportedChainId[],
): Promise<V1V2Pool[]> => {
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
