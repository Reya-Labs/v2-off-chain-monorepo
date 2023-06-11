import { GetPoolSwapInfoArgs, SwapPeripheryParams } from '../types';
import { getPeripheryContract } from '../../common/contract-generators';
import { BigNumber, providers } from 'ethers';
import { scale } from '../../common/math/scale';
import { getDefaultSqrtPriceLimit } from '../../common/math/getDefaultSqrtPriceLimits';
import { TRADER_TICK_LOWER, TRADER_TICK_UPPER } from '../../common/constants';
import {
  decodeInfoPostSwap,
  RawInfoPostSwap,
} from '../../common/errors/errorHandling';

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
  const peripheryContract = getPeripheryContract(peripheryAddress, provider);

  const availableNotional = getAvailableNotional(isFixedTaker);
  const maxLeverage = getMaxLeverage(isFixedTaker);
};
