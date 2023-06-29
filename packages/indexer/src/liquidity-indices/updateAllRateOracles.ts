import {
  pullRateOracleEntries,
  sendUpdateBatches,
} from '@voltz-protocol/bigquery-v2';
import { getLiquidityIndexUpdate } from './getLiquidityIndexUpdate';
import { getProvider } from '../services/getProvider';
import { getEnvironmentV2 } from '../services/envVars';
import { exponentialBackoff } from '@voltz-protocol/commons-v2/dist/types';

export const updateAllRateOracles = async (): Promise<void> => {
  const oracles = await pullRateOracleEntries(getEnvironmentV2());

  const responses = await Promise.allSettled(
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
  );

  const batches = responses.map((r) => {
    if (r.status === 'rejected') {
      throw r.reason;
    }

    return r.value;
  });

  await sendUpdateBatches(batches);
};
