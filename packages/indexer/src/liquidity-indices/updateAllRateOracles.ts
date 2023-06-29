import {
  pullRateOracleEntries,
  sendUpdateBatches,
} from '@voltz-protocol/bigquery-v2';
import { getLiquidityIndexUpdate } from './getLiquidityIndexUpdate';
import { getProvider } from '../services/getProvider';
import { getEnvironmentV2 } from '../services/envVars';
import {
  exponentialBackoff,
  fetchMultiplePromises,
} from '@voltz-protocol/commons-v2';

export const updateAllRateOracles = async (): Promise<void> => {
  const oracles = await pullRateOracleEntries(getEnvironmentV2());

  const batches = await fetchMultiplePromises(
    oracles.map(async ({ chainId, oracleAddress }) => {
      const provider = getProvider(chainId);
      const { number: blockNumber, timestamp: blockTimestamp } =
        await exponentialBackoff(() => provider.getBlock('latest'));

      return getLiquidityIndexUpdate(
        chainId,
        oracleAddress,
        blockNumber,
        blockTimestamp,
      );
    }),
    true,
  );

  await sendUpdateBatches(batches);
};
