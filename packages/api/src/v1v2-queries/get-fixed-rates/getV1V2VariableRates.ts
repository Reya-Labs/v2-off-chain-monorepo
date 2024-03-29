import { getVariableRates } from '@voltz-protocol/indexer-v1';
import { getV1V2Pool } from '../get-pools/getV1V2Pool';
import { HistoricalRate } from '@voltz-protocol/api-sdk-v2';
import { decodeV2PoolId } from '@voltz-protocol/commons-v2';
import { getVariableRatesV2 } from '../../v2-queries/get-variable-rates/getVariableRatesV2';
import { log } from '../../logging/log';

export const getV1V2VariableRates = async (
  poolId: string,
  fromSeconds: number,
  toSeconds: number,
): Promise<HistoricalRate[]> => {
  if (poolId.endsWith('v1')) {
    try {
      const v1Pool = await getV1V2Pool(poolId);

      const variableRates = getVariableRates(
        v1Pool.chainId,
        v1Pool.rateOracle.address,
        fromSeconds,
        toSeconds,
      );

      return variableRates;
    } catch (error) {
      log(`Unable to fetch variable rates for V1 pool ${poolId}`);
      return [];
    }
  }

  if (poolId.endsWith('v2')) {
    try {
      const { chainId, marketId } = decodeV2PoolId(poolId);

      const variableRates = await getVariableRatesV2(
        chainId,
        marketId,
        fromSeconds,
        toSeconds,
      );

      return variableRates;
    } catch (error) {
      log(`Unable to fetch variable rates for V2 pool ${poolId}`);
      return [];
    }
  }

  log(`Could not find V1V2 pool with id ${poolId}`);
  return [];
};
