import { HistoricalRate } from '@voltz-protocol/api-v2-types';
import { pullLiquidityIndicesByRateOracle } from '@voltz-protocol/bigquery-v2';
import {
  Address,
  SECONDS_IN_HOUR,
  SECONDS_IN_YEAR,
} from '@voltz-protocol/commons-v2';
import { getEnvironmentV2 } from '../../services/envVars';

export const getVariableRatesV2 = async (
  chainId: number,
  oracleAddress: Address,
  fromSeconds: number,
  toSeconds: number,
): Promise<HistoricalRate[]> => {
  const environmentTag = getEnvironmentV2();

  const frequency = SECONDS_IN_HOUR;

  const liquidityIndices = await pullLiquidityIndicesByRateOracle(
    environmentTag,
    chainId,
    oracleAddress,
    fromSeconds - frequency,
    toSeconds,
    frequency,
  );

  if (liquidityIndices.length <= 1) {
    return [];
  }

  const variableRates: HistoricalRate[] = [];

  for (let i = 1; i < liquidityIndices.length; i++) {
    const timeDelta =
      (liquidityIndices[i].blockTimestamp -
        liquidityIndices[i - 1].blockTimestamp) /
      SECONDS_IN_YEAR;

    const rate =
      Math.pow(
        liquidityIndices[i].liquidityIndex /
          liquidityIndices[i - 1].liquidityIndex,
        1 / timeDelta,
      ) - 1;

    variableRates.push({
      rate,
      timestamp: liquidityIndices[i].blockTimestamp,
    });
  }

  return variableRates;
};
