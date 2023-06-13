import { pullVammsByChains } from '@voltz-protocol/bigquery-v2';
import { V2PoolsResult } from './types';
import { buildPool } from './buildPool';
import { SupportedChainId } from '@voltz-protocol/commons-v2';

export const getPools = async (
  chainIds: SupportedChainId[],
): Promise<V2PoolsResult> => {
  const pools = await pullVammsByChains(chainIds);

  const promises = pools.map(buildPool);
  const responses = await Promise.allSettled(promises);

  const result = responses.map((r) => {
    if (r.status === 'rejected') {
      throw r.reason;
    }

    return r.value;
  });

  return result;
};
