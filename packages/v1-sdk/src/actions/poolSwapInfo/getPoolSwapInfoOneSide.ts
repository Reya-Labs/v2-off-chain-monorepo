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

  let availableNotional = BigNumber.from(0);
  const maxLeverage = BigNumber.from(0);

  const swapPeripheryParamsLargeSwap: SwapPeripheryParams = {
    marginEngineAddress,
    isFT: isFixedTaker,
    notional: scale(1000000000000000, tokenDecimals),
    sqrtPriceLimitX96: getDefaultSqrtPriceLimit(isFixedTaker),
    tickLower: TRADER_TICK_LOWER,
    tickUpper: TRADER_TICK_UPPER,
    marginDelta: '0',
  };

  const swapPeripheryParamsSmallSwap: SwapPeripheryParams = {
    marginEngineAddress,
    isFT: isFixedTaker,
    notional: scale(1, tokenDecimals),
    sqrtPriceLimitX96: getDefaultSqrtPriceLimit(isFixedTaker),
    tickLower: TRADER_TICK_LOWER,
    tickUpper: TRADER_TICK_UPPER,
    marginDelta: '0',
  };

  await peripheryContract.callStatic
    .swap(
      swapPeripheryParamsLargeSwap.marginEngineAddress,
      swapPeripheryParamsLargeSwap.isFT,
      swapPeripheryParamsLargeSwap.notional,
      swapPeripheryParamsLargeSwap.sqrtPriceLimitX96,
      swapPeripheryParamsLargeSwap.tickLower,
      swapPeripheryParamsLargeSwap.tickUpper,
      swapPeripheryParamsLargeSwap.marginDelta,
    )
    .then(
      (result: any) => {
        availableNotional = result[1];
      },
      (error: any) => {
        const result: RawInfoPostSwap = decodeInfoPostSwap(error);
        availableNotional = result.availableNotional;
      },
    );

  let marginRequirement = BigNumber.from(0);

  await peripheryContract.callStatic
    .swap(
      swapPeripheryParamsSmallSwap.marginEngineAddress,
      swapPeripheryParamsSmallSwap.isFT,
      swapPeripheryParamsSmallSwap.notional,
      swapPeripheryParamsSmallSwap.sqrtPriceLimitX96,
      swapPeripheryParamsSmallSwap.tickLower,
      swapPeripheryParamsSmallSwap.tickUpper,
      swapPeripheryParamsSmallSwap.marginDelta,
    )
    .then(
      (result: any) => {
        marginRequirement = result[4];
      },
      (error: any) => {
        const result: RawInfoPostSwap = decodeInfoPostSwap(error);
        marginRequirement = result.marginRequirement;
      },
    );
};
