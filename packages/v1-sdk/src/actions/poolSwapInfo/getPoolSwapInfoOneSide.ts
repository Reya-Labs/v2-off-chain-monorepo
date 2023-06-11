import { providers } from 'ethers';
import { getAvailableNotional } from './getAvailableNotional';
import { getMaxLeverage } from './getMaxLeverage';

export type GetPoolSwapInfoOneSideArgs = {
  isFixedTaker: boolean;
  peripheryAddress: string;
  marginEngineAddress: string;
  tokenDecimals: number;
  provider: providers.Provider;
};

export type GetPoolSwapInfoOneSideArgsResults = {
  availableNotional: number;
  maxLeverage: number;
};

export const getPoolSwapInfoOneSide = async ({
  isFixedTaker,
  peripheryAddress,
  marginEngineAddress,
  tokenDecimals,
  provider,
}: GetPoolSwapInfoOneSideArgs): Promise<GetPoolSwapInfoOneSideArgsResults> => {
  const availableNotional = await getAvailableNotional({
    isFixedTaker,
    marginEngineAddress,
    tokenDecimals,
    peripheryAddress,
    provider,
  });
  const maxLeverage = await getMaxLeverage({
    isFixedTaker,
    marginEngineAddress,
    tokenDecimals,
    peripheryAddress,
    provider,
  });

  return {
    availableNotional,
    maxLeverage,
  };
};
