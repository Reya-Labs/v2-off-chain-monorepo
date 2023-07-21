import { fetchMultiplePromises } from '@voltz-protocol/commons-v2';
import { pullAllChainPools } from '@voltz-protocol/indexer-v1';
import { buildV1Pool } from './buildV1Pool';
import { V1Pool } from '@voltz-protocol/api-sdk-v2';
import { log } from '../../logging/log';

export const getV1Pools = async (chainIds: number[]): Promise<V1Pool[]> => {
  const rawPools = await pullAllChainPools(chainIds);
  const promises = rawPools.map(buildV1Pool);
  const { data: pools, isError, error } = await fetchMultiplePromises(promises);

  if (isError) {
    log(
      `Could not load all v1 pools (${pools.length} / ${promises.length} loaded). Reason: ${error}.`,
    );
  }

  return pools;
};
