import { BigNumber, providers } from 'ethers';
import { SwapPeripheryParams } from '../types';
import { scale } from '../../common/math/scale';
import { getDefaultSqrtPriceLimit } from '../../common/math/getDefaultSqrtPriceLimits';
import { TRADER_TICK_LOWER, TRADER_TICK_UPPER } from '../../common/constants';
import {
  decodeInfoPostSwap,
  RawInfoPostSwap,
} from '../../common/errors/errorHandling';
import { getPeripheryContract } from '../../common/contract-generators';
import { descale } from '../../common/math/descale';

export type GetMaxLeverageArgs = {
  isFixedTaker: boolean;
  marginEngineAddress: string;
  tokenDecimals: number;
  peripheryAddress: string;
  provider: providers.Provider;
};

export const getMaxLeverage = async ({
  isFixedTaker,
  marginEngineAddress,
  tokenDecimals,
  peripheryAddress,
  provider,
}: GetMaxLeverageArgs): Promise<number> => {
  const peripheryContract = getPeripheryContract(peripheryAddress, provider);

  const smallNotionalScaled = scale(1, tokenDecimals);

  const swapPeripheryParamsSmallSwap: SwapPeripheryParams = {
    marginEngineAddress,
    isFT: isFixedTaker,
    notional: smallNotionalScaled,
    sqrtPriceLimitX96: getDefaultSqrtPriceLimit(isFixedTaker),
    tickLower: TRADER_TICK_LOWER,
    tickUpper: TRADER_TICK_UPPER,
    marginDelta: '0',
  };

  let marginRequirement = BigNumber.from(0);
  let maxLeverage = BigNumber.from(0);

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

  if (marginRequirement.gt(0)) {
    maxLeverage = BigNumber.from(smallNotionalScaled)
      .mul(BigNumber.from(10).pow(tokenDecimals))
      .div(marginRequirement);
  }

  return Math.floor(descale(maxLeverage, tokenDecimals));
};
