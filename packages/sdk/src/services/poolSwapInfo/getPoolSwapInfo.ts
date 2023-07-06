import { getAvailableNotional } from '../../gateway/getAvailableNotional';
import { GetPoolSwapInfoResults } from './types';

export const getPoolSwapInfo = async (
  poolId: string,
): Promise<GetPoolSwapInfoResults> => {
  const availableNotional = await getAvailableNotional(poolId);

  return {
    availableNotionalFixedTaker: availableNotional.short,
    availableNotionalVariableTaker: availableNotional.long,
  };
};
