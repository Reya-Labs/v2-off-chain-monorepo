import { pullVammsByChains } from '@voltz-protocol/bigquery-v2';
import { buildV2Pool } from './buildV2Pool';
import { SupportedChainId } from '@voltz-protocol/commons-v2';
import { V2Pool } from '@voltz-protocol/api-v2-types';

export const getV2Pools = async (
  chainIds: SupportedChainId[],
): Promise<V2Pool[]> => {
  const pools = await pullVammsByChains(chainIds);

  const promises = pools.map(buildV2Pool);
  const responses = await Promise.allSettled(promises);

  const result = responses.map((r) => {
    if (r.status === 'rejected') {
      throw r.reason;
    }

    return r.value;
  });

  return result;
};
