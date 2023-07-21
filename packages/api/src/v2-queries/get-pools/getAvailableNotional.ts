import {
  getAvailableBaseInRange,
  getLiquidityIndicesAtByMarketId,
  pullIrsVammPoolEntry,
} from '@voltz-protocol/bigquery-v2';
import {
  encodeV2PoolId,
  fetchMultiplePromises,
  getTimestampInSeconds,
} from '@voltz-protocol/commons-v2';
import { getEnvironmentV2 } from '../../services/envVars';
import { AvailableNotional } from '@voltz-protocol/api-sdk-v2';
import { log } from '../../logging/log';

export const getV2AvailableNotional = async (
  chainId: number,
  marketId: string,
  maturityTimestamp: number,
): Promise<AvailableNotional> => {
  const environmentTag = getEnvironmentV2();
  const nowSeconds = getTimestampInSeconds();

  const poolId = encodeV2PoolId({
    chainId,
    marketId,
    maturityTimestamp,
  });

  const pool = await pullIrsVammPoolEntry(getEnvironmentV2(), poolId);

  if (pool === null) {
    log(`Could not find pool ${chainId}-${marketId}-${maturityTimestamp}`);

    return {
      short: 0,
      long: 0,
    };
  }

  const [currentLiquidityIndex] = await getLiquidityIndicesAtByMarketId(
    environmentTag,
    chainId,
    marketId,
    [nowSeconds],
  );

  if (currentLiquidityIndex === null) {
    return {
      short: 0,
      long: 0,
    };
  }

  const { data: responses, isError } = await fetchMultiplePromises([
    getAvailableBaseInRange(
      environmentTag,
      chainId,
      marketId,
      maturityTimestamp,
      pool.currentTick,
      -100000,
    ),

    getAvailableBaseInRange(
      environmentTag,
      chainId,
      marketId,
      maturityTimestamp,
      pool.currentTick,
      100000,
    ),
  ]);

  if (isError) {
    return {
      short: 0,
      long: 0,
    };
  }

  const [absBaseLong, absBaseShort] = responses;

  return {
    short: -absBaseShort * currentLiquidityIndex,
    long: absBaseLong * currentLiquidityIndex,
  };
};
