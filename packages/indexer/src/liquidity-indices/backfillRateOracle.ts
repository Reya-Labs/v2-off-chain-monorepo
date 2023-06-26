import {
  Address,
  SECONDS_IN_DAY,
  getBlockAtTimestamp,
  getTimestampInSeconds,
} from '@voltz-protocol/commons-v2';
import { getAndPushLiquidityIndex } from './getAndPushLiquidityIndex';
import { log } from '../logging/log';
import { getProvider } from '../services/getProvider';

// configuration
const frequencySeconds = SECONDS_IN_DAY;
const lookbackWindowSeconds = 3 * SECONDS_IN_DAY;

export const backfillRateOracle = async (
  chainId: number,
  oracleAddress: Address,
) => {
  const nowSeconds = getTimestampInSeconds();
  const provider = getProvider(chainId);

  for (
    let i = nowSeconds - lookbackWindowSeconds;
    i <= nowSeconds;
    i += frequencySeconds
  ) {
    try {
      const blockNumber = await getBlockAtTimestamp(provider, i);
      await getAndPushLiquidityIndex(chainId, oracleAddress, blockNumber, i);
    } catch (error) {
      log(
        `[Backfilling ${chainId}-${oracleAddress}] Could not add datapoint at ${i}. (Reason: ${
          (error as Error).message
        })`,
      );
    }
  }
};
