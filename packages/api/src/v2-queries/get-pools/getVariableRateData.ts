import { getLiquidityIndexAt } from '@voltz-protocol/bigquery-v2';
import {
  Address,
  SupportedChainId,
  getApy,
  getTimestampInSeconds,
  isNull,
} from '@voltz-protocol/commons-v2';
import { getEnvironmentV2 } from '../../services/envVars';

export type GetVariableRateDataResponse = {
  currentVariableRate: number;
  currentLiquidityIndex: number;
  variableRateChange: number;
};

// todo: await multiple promises at once
export const getVariableRateData = async (
  chainId: SupportedChainId,
  rateOracle: Address,
  lookbackWindowSeconds: number,
  method: 'linear' | 'compounding' = 'compounding',
): Promise<GetVariableRateDataResponse> => {
  const nowSeconds = getTimestampInSeconds();

  const currentLiquidityIndex = await getLiquidityIndexAt(
    getEnvironmentV2(),
    chainId,
    rateOracle,
    nowSeconds,
  );

  if (isNull(currentLiquidityIndex)) {
    return {
      currentLiquidityIndex: 0,
      currentVariableRate: 0,
      variableRateChange: 0,
    };
  }

  const timestampLWAgo = nowSeconds - lookbackWindowSeconds;
  const liquidityIndexLWAgo = await getLiquidityIndexAt(
    getEnvironmentV2(),
    chainId,
    rateOracle,
    timestampLWAgo,
  );

  if (isNull(liquidityIndexLWAgo)) {
    return {
      currentLiquidityIndex: currentLiquidityIndex as number,
      currentVariableRate: 0,
      variableRateChange: 0,
    };
  }

  const currentVariableRate = getApy(
    {
      timestamp: timestampLWAgo,
      index: liquidityIndexLWAgo as number,
    },
    {
      timestamp: nowSeconds,
      index: currentLiquidityIndex as number,
    },
    method,
  );

  const timestamp2LWAgo = nowSeconds - 2 * lookbackWindowSeconds;
  const liquidityIndex2LWAgo = await getLiquidityIndexAt(
    getEnvironmentV2(),
    chainId,
    rateOracle,
    timestamp2LWAgo,
  );

  if (isNull(liquidityIndex2LWAgo)) {
    return {
      currentLiquidityIndex: currentLiquidityIndex as number,
      currentVariableRate,
      variableRateChange: 0,
    };
  }

  const variableRateLWAgo = getApy(
    {
      timestamp: timestamp2LWAgo,
      index: liquidityIndex2LWAgo as number,
    },
    {
      timestamp: timestampLWAgo,
      index: liquidityIndexLWAgo as number,
    },
    method,
  );

  const variableRateChange = currentVariableRate - variableRateLWAgo;

  return {
    currentLiquidityIndex: currentLiquidityIndex as number,
    currentVariableRate,
    variableRateChange,
  };
};
