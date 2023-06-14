import {
  Address,
  SECONDS_IN_DAY,
  getBlockAtTimestamp,
  getTimestampInSeconds,
} from '@voltz-protocol/commons-v2';
import { getAndPushLiquidityIndex } from './getAndPushLiquidityIndex';

// configuration
const frequencySeconds = SECONDS_IN_DAY;
const lookbackWindowSeconds = 30 * SECONDS_IN_DAY;

export const backfillRateOracle = async (
  chainId: number,
  oracleAddress: Address,
) => {
  const nowSeconds = getTimestampInSeconds();

  for (
    let i = nowSeconds - lookbackWindowSeconds;
    i <= nowSeconds;
    i += frequencySeconds
  ) {
    const blockNumber = await getBlockAtTimestamp(chainId, i);
    await getAndPushLiquidityIndex(chainId, oracleAddress, blockNumber, i);
  }
};
