import { HistoricalRate } from '@voltz-protocol/api-sdk-v2';
import { getLiquidityIndicesAtByMarketId } from '@voltz-protocol/bigquery-v2';
import { getApy } from '@voltz-protocol/commons-v2';
import { getEnvironmentV2 } from '../../services/envVars';

export const getVariableRatesV2 = async (
  chainId: number,
  marketId: string,
  fromSeconds: number,
  toSeconds: number,
): Promise<HistoricalRate[]> => {
  const environmentTag = getEnvironmentV2();

  // configurable
  const numberOfPoints = 24;
  const frequency = Math.floor((toSeconds - fromSeconds) / numberOfPoints);

  const timestamps = [];
  for (let i = -1; i < numberOfPoints; i++) {
    timestamps.push(fromSeconds + i * frequency);
  }
  timestamps.push(toSeconds);

  const liquidityIndices = await getLiquidityIndicesAtByMarketId(
    environmentTag,
    chainId,
    marketId,
    timestamps,
  );

  if (liquidityIndices.length <= 1) {
    return [];
  }

  const variableRates: HistoricalRate[] = [];

  for (let i = 1; i < liquidityIndices.length; i++) {
    const prevLi = liquidityIndices[i - 1];
    const prevTs = timestamps[i - 1];

    const currLi = liquidityIndices[i];
    const currTs = timestamps[i];

    if (prevLi === null || currLi === null) {
      continue;
    }

    const rate = getApy(
      {
        index: prevLi,
        timestamp: prevTs,
      },
      {
        index: currLi,
        timestamp: currTs,
      },
      'compounding',
    );

    variableRates.push({
      rate,
      timestamp: currTs,
    });
  }

  variableRates.sort((a, b) => a.timestamp - b.timestamp);

  return variableRates;
};
