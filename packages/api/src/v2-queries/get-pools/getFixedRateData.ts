import { getTickAtTimestamp } from '@voltz-protocol/bigquery-v2';
import {
  getTimestampInSeconds,
  isNull,
  tickToFixedRate,
} from '@voltz-protocol/commons-v2';
import { getEnvironmentV2 } from '../../services/envVars';

export type GetFixedRateDataResponse = {
  currentFixedRate: number;
  fixedRateChange: number;
};

// todo: await multiple promises at once
export const getFixedRateData = async (
  chainId: number,
  marketId: string,
  maturityTimestamp: number,
  currentTick: number,
  lookbackWindowSeconds: number,
): Promise<GetFixedRateDataResponse> => {
  const nowSeconds = getTimestampInSeconds();

  const tickLWAgo = await getTickAtTimestamp(
    getEnvironmentV2(),
    chainId,
    marketId,
    maturityTimestamp,
    nowSeconds - lookbackWindowSeconds,
  );

  const currentFixedRate = tickToFixedRate(currentTick);

  if (isNull(tickLWAgo)) {
    return {
      currentFixedRate,
      fixedRateChange: 0,
    };
  }

  const fixedRateLWAgo = tickToFixedRate(tickLWAgo as number);
  const fixedRateChange = fixedRateLWAgo - currentFixedRate;

  return {
    currentFixedRate,
    fixedRateChange,
  };
};
