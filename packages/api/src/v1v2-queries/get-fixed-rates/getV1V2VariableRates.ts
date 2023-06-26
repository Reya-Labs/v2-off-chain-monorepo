import { getVariableRates } from '@voltz-protocol/indexer-v1';
import { getV1V2Pool } from '../get-pools/getV1V2Pool';
import { HistoricalRate } from '@voltz-protocol/api-v2-types';

export const getV1V2VariableRates = async (
  poolId: string,
  fromSeconds: number,
  toSeconds: number,
): Promise<HistoricalRate[]> => {
  const v1v2Pool = await getV1V2Pool(poolId);

  if (v1v2Pool.isV2) {
    // todo: to be implemented
    return [];
  }

  // v1
  return getVariableRates(
    v1v2Pool.chainId,
    v1v2Pool.rateOracle.address,
    fromSeconds,
    toSeconds,
  );
};
