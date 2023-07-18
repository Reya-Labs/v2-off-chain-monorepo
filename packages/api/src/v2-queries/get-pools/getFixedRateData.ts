import { getTickAtTimestamp } from '@voltz-protocol/bigquery-v2';
import {
  getTimestampInSeconds,
  tickToFixedRate,
} from '@voltz-protocol/commons-v2';
import { getEnvironmentV2 } from '../../services/envVars';

export type GetFixedRateDataResponse = {
  currentFixedRate: number;
  fixedRateChange: number;
};

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

  if (tickLWAgo === null) {
    return {
      currentFixedRate,
      fixedRateChange: 0,
    };
  }

  const fixedRateLWAgo = tickToFixedRate(tickLWAgo);
  const fixedRateChange = fixedRateLWAgo - currentFixedRate;

  return {
    currentFixedRate,
    fixedRateChange,
  };
};
