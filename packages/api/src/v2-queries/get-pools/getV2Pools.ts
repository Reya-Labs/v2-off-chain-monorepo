import { pullIrsVammPoolEntriesByChains } from '@voltz-protocol/bigquery-v2';
import { buildV2Pool } from './buildV2Pool';
import { fetchMultiplePromises } from '@voltz-protocol/commons-v2';
import { V2Pool } from '@voltz-protocol/api-sdk-v2';
import { getEnvironmentV2 } from '../../services/envVars';
import { log } from '../../logging/log';

export const getV2Pools = async (chainIds: number[]): Promise<V2Pool[]> => {
  const pools = await pullIrsVammPoolEntriesByChains(
    getEnvironmentV2(),
    chainIds,
  );

  const {
    data: responses,
    isError,
    error,
  } = await fetchMultiplePromises(pools.map(buildV2Pool));

  if (isError) {
    log(
      `Could not load all v2 pools (${pools.length} / ${pools.length} loaded). Reason: ${error}.`,
    );
  }

  return responses;
};
