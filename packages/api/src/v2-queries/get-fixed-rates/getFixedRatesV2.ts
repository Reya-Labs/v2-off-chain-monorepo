import { HistoricalRate } from '@voltz-protocol/api-sdk-v2';
import { pullTicksByPool } from '@voltz-protocol/bigquery-v2';
import { tickToFixedRate } from '@voltz-protocol/commons-v2';
import { getEnvironmentV2 } from '../../services/envVars';

export const getFixedRatesV2 = async (
  chainId: number,
  marketId: string,
  maturityTimestamp: number,
  fromSeconds: number,
  toSeconds: number,
): Promise<HistoricalRate[]> => {
  const environmentTag = getEnvironmentV2();

  const ticks = await pullTicksByPool(
    environmentTag,
    chainId,
    marketId,
    maturityTimestamp,
    fromSeconds,
    toSeconds,
  );

  return ticks.map(
    (t): HistoricalRate => ({
      rate: tickToFixedRate(t.tick),
      timestamp: t.blockTimestamp,
    }),
  );
};
