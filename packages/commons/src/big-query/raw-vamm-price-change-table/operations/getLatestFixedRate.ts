import { isNull } from '../../../utils/isNull';
import { tickToFixedRate } from '../../../utils/vamm/tickConversions';
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
