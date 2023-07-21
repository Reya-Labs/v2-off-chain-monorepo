import { getAvailableNotional } from '@voltz-protocol/api-sdk-v2';
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
