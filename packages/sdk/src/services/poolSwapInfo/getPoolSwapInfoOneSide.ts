import { getAvailableNotional } from './getAvailableNotional';
import { getMaxLeverage } from './getMaxLeverage';
import {
  GetPoolSwapInfoOneSideArgs,
  GetPoolSwapInfoOneSideArgsResults,
} from './types';

export const getPoolSwapInfoOneSide = async ({
  isFT,
  chainId,
  tokenDecimals,
  params,
}: GetPoolSwapInfoOneSideArgs): Promise<GetPoolSwapInfoOneSideArgsResults> => {
  const availableNotional = await getAvailableNotional({
    isFT,
    chainId,
    tokenDecimals,
    params,
  });
  const maxLeverage = await getMaxLeverage({
    isFT,
    chainId,
    tokenDecimals,
    params,
  });

  return {
    availableNotional,
    maxLeverage,
  };
};
