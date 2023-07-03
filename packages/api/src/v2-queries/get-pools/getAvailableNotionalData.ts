import { getBaseInRange } from '@voltz-protocol/bigquery-v2';
import {
  SupportedChainId,
  fetchMultiplePromises,
} from '@voltz-protocol/commons-v2';
import { getEnvironmentV2 } from '../../services/envVars';

export const getAvailableNotionalData = async (
  chainId: SupportedChainId,
  marketId: string,
  maturityTimestamp: number,
  currentTick: number,
  liquidityIndex: number,
): Promise<{
  short: number;
  long: number;
}> => {
  const environmentTag = getEnvironmentV2();

  const responses = await fetchMultiplePromises(
    [
      getBaseInRange(
        environmentTag,
        chainId,
        marketId,
        maturityTimestamp,
        -100000,
        currentTick,
      ),

      getBaseInRange(
        environmentTag,
        chainId,
        marketId,
        maturityTimestamp,
        currentTick,
        100000,
      ),
    ],
    true,
  );

  return {
    short: responses[1] * liquidityIndex,
    long: responses[0] * liquidityIndex,
  };
};
