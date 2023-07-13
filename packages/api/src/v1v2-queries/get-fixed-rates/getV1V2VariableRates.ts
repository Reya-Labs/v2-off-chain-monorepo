import { getVariableRates } from '@voltz-protocol/indexer-v1';
import { getV1V2Pool } from '../get-pools/getV1V2Pool';
import { HistoricalRate } from '@voltz-protocol/api-v2-types';
import { convertToAddress } from '@voltz-protocol/commons-v2';
import { getVariableRatesV2 } from '../../v2-queries/get-variable-rates/getVariableRatesV2';

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
      console.error(`Unable to fetch variable rates for V1 pool ${poolId}`);
      return [];
    }
  }

  if (poolId.endsWith('v2')) {
    try {
      const v2Pool = await getV1V2Pool(poolId);

      const variableRates = await getVariableRatesV2(
        v2Pool.chainId,
        convertToAddress(v2Pool.rateOracle.address),
        fromSeconds,
        toSeconds,
      );

      return variableRates;
    } catch (error) {
      console.error(`Unable to fetch variable rates for V2 pool ${poolId}`);
      return [];
    }
  }

  console.error(`Could not find V1V2 pool with id ${poolId}`);
  return [];
};
