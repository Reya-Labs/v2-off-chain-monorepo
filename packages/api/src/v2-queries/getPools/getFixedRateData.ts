import {
  getCurrentVammTick,
  getTickAtTimestamp,
} from '@voltz-protocol/bigquery-v2';
import {
  SupportedChainId,
  getTimestampInSeconds,
  isNull,
  tickToFixedRate,
} from '@voltz-protocol/commons-v2';

export type GetFixedRateDataResponse = {
  currentFixedRate: number;
  fixedRateChange: number;
};

// todo: use Promise.allSettled()
export const getFixedRateData = async (
  chainId: SupportedChainId,
  marketId: string,
  maturityTimestamp: number,
  lookbackWindowSeconds: number,
): Promise<GetFixedRateDataResponse> => {
  const nowSeconds = getTimestampInSeconds();

  const currentTick = await getCurrentVammTick(
    chainId,
    marketId,
    maturityTimestamp,
  );

  if (isNull(currentTick)) {
    return {
      currentFixedRate: 0,
      fixedRateChange: 0,
    };
  }

  const tickLWAgo = await getTickAtTimestamp(
    chainId,
    marketId,
    maturityTimestamp,
    nowSeconds - lookbackWindowSeconds,
  );

  const currentFixedRate = tickToFixedRate(currentTick as number);

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
