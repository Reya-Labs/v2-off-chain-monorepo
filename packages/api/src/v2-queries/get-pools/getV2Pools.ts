import { pullVammsByChains } from '@voltz-protocol/bigquery-v2';
import { buildV2Pool } from './buildV2Pool';
import {
  SupportedChainId,
  fetchMultiplePromises,
} from '@voltz-protocol/commons-v2';
import { V2Pool } from '@voltz-protocol/api-v2-types';
import { getEnvironmentV2 } from '../../services/envVars';

export const getV2Pools = async (
  chainIds: SupportedChainId[],
): Promise<V2Pool[]> => {
  const pools = await pullVammsByChains(getEnvironmentV2(), chainIds);

  const responses = await fetchMultiplePromises(pools.map(buildV2Pool));

  return responses;
};
