import { getAvailableNotional } from '../../gateway/getAvailableNotional';
import { GetPoolSwapInfoResults } from './types';

export const getPoolSwapInfo = async (
  poolId: string,
): Promise<GetPoolSwapInfoResults> => {
  const availableNotional = await getAvailableNotional(poolId);

  return {
    availableNotionalFixedTaker: availableNotional.short,
    availableNotionalVariableTaker: availableNotional.long,
    maxLeverageFixedTaker: Number.MAX_SAFE_INTEGER,
    maxLeverageVariableTaker: Number.MAX_SAFE_INTEGER,
  };
};
