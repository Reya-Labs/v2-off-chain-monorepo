import { getFixedRates as getFixedRatesV1 } from '@voltz-protocol/indexer-v1';
import { decodeV1PoolId, decodeV2PoolId } from '@voltz-protocol/commons-v2';
import { HistoricalRate } from '@voltz-protocol/api-sdk-v2';
import { getFixedRatesV2 } from '../../v2-queries/get-fixed-rates/getFixedRatesV2';
import { log } from '../../logging/log';

export const getV1V2FixedRates = async (
  poolId: string,
  fromSeconds: number,
  toSeconds: number,
): Promise<HistoricalRate[]> => {
  if (poolId.endsWith('v1')) {
    try {
      const { chainId, vammAddress } = decodeV1PoolId(poolId);
      const fixedRates = await getFixedRatesV1(
        chainId,
        vammAddress,
        fromSeconds,
        toSeconds,
      );
      return fixedRates;
    } catch (error) {
      log(`Unable to fetch fixed rates for V1 pool ${poolId}`);
      return [];
    }
  }

  if (poolId.endsWith('v2')) {
    try {
      const { chainId, marketId, maturityTimestamp } = decodeV2PoolId(poolId);

      const fixedRates = await getFixedRatesV2(
        chainId,
        marketId,
        maturityTimestamp,
        fromSeconds,
        toSeconds,
      );

      return fixedRates;
    } catch (error) {
      log(`Unable to fetch fixed rates for V2 pool ${poolId}`);
      return [];
    }
  }

  log(`Could not find V1V2 pool with id ${poolId}`);
  return [];
};
