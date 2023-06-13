import { getTimestampInSeconds } from '@voltz-protocol/commons-v2';
import { getTickAtTimestamp } from './getTickAtTimestamp';

/**
 Get latest tick of VAMM
 */
export const getCurrentVammTick = async (
  chainId: number,
  marketId: string,
  maturityTimestamp: number,
): Promise<number | null> => {
  const currentTimestamp = getTimestampInSeconds();
  const latestTick = await getTickAtTimestamp(
    chainId,
    marketId,
    maturityTimestamp,
    currentTimestamp,
  );

  return latestTick;
};
