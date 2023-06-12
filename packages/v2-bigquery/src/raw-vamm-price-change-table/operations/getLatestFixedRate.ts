import { isNull, tickToFixedRate } from '@voltz-protocol/commons-v2';
import { getLatestVammTick } from './getLatestVammTick';

/**
 Get latest fixed rate of VAMM
 */
export const getLatestFixedRate = async (
  chainId: number,
  marketId: string,
  maturityTimestamp: number,
): Promise<number | null> => {
  const tick = await getLatestVammTick(chainId, marketId, maturityTimestamp);

  if (isNull(tick)) {
    return null;
  }

  const fixedRate = tickToFixedRate(tick as number);

  return fixedRate;
};
