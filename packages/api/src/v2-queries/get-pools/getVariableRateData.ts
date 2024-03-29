import {
  Address,
  getApy,
  getTimestampInSeconds,
} from '@voltz-protocol/commons-v2';
import { getEnvironmentV2 } from '../../services/envVars';
import { getLiquidityIndicesAt } from '@voltz-protocol/bigquery-v2';

export type GetVariableRateDataResponse = {
  currentVariableRate: number;
  currentLiquidityIndex: number;
  variableRateChange: number;
};

export const getVariableRateData = async (
  chainId: number,
  rateOracle: Address,
  lookbackWindowSeconds: number,
  method: 'linear' | 'compounding' = 'compounding',
): Promise<GetVariableRateDataResponse> => {
  const nowSeconds = getTimestampInSeconds();
  const timestampLWAgo = nowSeconds - lookbackWindowSeconds;
  const timestamp2LWAgo = nowSeconds - 2 * lookbackWindowSeconds;

  const environmentTag = getEnvironmentV2();

  const [currentLiquidityIndex, liquidityIndexLWAgo, liquidityIndex2LWAgo] =
    await getLiquidityIndicesAt(environmentTag, chainId, rateOracle, [
      nowSeconds,
      timestampLWAgo,
      timestamp2LWAgo,
    ]);

  if (currentLiquidityIndex === null) {
    return {
      currentLiquidityIndex: 0,
      currentVariableRate: 0,
      variableRateChange: 0,
    };
  }

  if (liquidityIndexLWAgo === null) {
    return {
      currentLiquidityIndex: currentLiquidityIndex,
      currentVariableRate: 0,
      variableRateChange: 0,
    };
  }

  const currentVariableRate = getApy(
    {
      timestamp: timestampLWAgo,
      index: liquidityIndexLWAgo,
    },
    {
      timestamp: nowSeconds,
      index: currentLiquidityIndex,
    },
    method,
  );

  if (liquidityIndex2LWAgo === null) {
    return {
      currentLiquidityIndex: currentLiquidityIndex,
      currentVariableRate,
      variableRateChange: 0,
    };
  }

  const variableRateLWAgo = getApy(
    {
      timestamp: timestamp2LWAgo,
      index: liquidityIndex2LWAgo,
    },
    {
      timestamp: timestampLWAgo,
      index: liquidityIndexLWAgo,
    },
    method,
  );

  const variableRateChange = currentVariableRate - variableRateLWAgo;

  return {
    currentLiquidityIndex: currentLiquidityIndex,
    currentVariableRate,
    variableRateChange,
  };
};
