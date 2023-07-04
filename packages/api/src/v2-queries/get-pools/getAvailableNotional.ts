import {
  getAvailableBaseInRange,
  getCurrentVammTick,
  getLiquidityIndexAt,
  pullMarketEntry,
} from '@voltz-protocol/bigquery-v2';
import {
  SupportedChainId,
  fetchMultiplePromises,
  getTimestampInSeconds,
  isNull,
} from '@voltz-protocol/commons-v2';
import { getEnvironmentV2 } from '../../services/envVars';
import { AvailableNotional } from '@voltz-protocol/api-v2-types';

export const getV2AvailableNotional = async (
  chainId: SupportedChainId,
  marketId: string,
  maturityTimestamp: number,
): Promise<AvailableNotional> => {
  const environmentTag = getEnvironmentV2();
  const nowSeconds = getTimestampInSeconds();

  const market = await pullMarketEntry(environmentTag, chainId, marketId);

  if (!market) {
    throw new Error(
      `Pool does not have associated market entry (${chainId}-${marketId})`,
    );
  }

  const currentTick = await getCurrentVammTick(
    environmentTag,
    chainId,
    marketId,
    maturityTimestamp,
  );

  if (isNull(currentTick)) {
    console.error(
      `Current tick is missing for ${chainId}-${marketId}-${maturityTimestamp}`,
    );
    return {
      short: 0,
      long: 0,
    };
  }

  const currentLiquidityIndex = await getLiquidityIndexAt(
    environmentTag,
    chainId,
    market.oracleAddress,
    nowSeconds,
  );

  if (isNull(currentLiquidityIndex)) {
    return {
      short: 0,
      long: 0,
    };
  }

  const responses = await fetchMultiplePromises(
    [
      getAvailableBaseInRange(
        environmentTag,
        chainId,
        marketId,
        maturityTimestamp,
        currentTick as number,
        -100000,
      ),

      getAvailableBaseInRange(
        environmentTag,
        chainId,
        marketId,
        maturityTimestamp,
        currentTick as number,
        100000,
      ),
    ],
    true,
  );

  return {
    short: -responses[1] * (currentLiquidityIndex as number),
    long: responses[0] * (currentLiquidityIndex as number),
  };
};
