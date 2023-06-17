import { getAvailableNotional } from './getAvailableNotional';
import { getMaxLeverage } from './getMaxLeverage';
import {
  GetPoolSwapInfoOneSideArgs,
  GetPoolSwapInfoOneSideArgsResults,
} from './types';

export const getPoolSwapInfoOneSide = async ({
  isFT,
  chainId,
  params,
}: GetPoolSwapInfoOneSideArgs): Promise<GetPoolSwapInfoOneSideArgsResults> => {
  const availableNotional = await getAvailableNotional({
    isFT,
    chainId,
    params,
  });
  const maxLeverage = await getMaxLeverage({
    isFT,
    chainId,
    params,
  });

  return {
    availableNotional,
    maxLeverage,
  };
};
