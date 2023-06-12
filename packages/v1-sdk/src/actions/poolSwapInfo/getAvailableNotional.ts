import { SwapPeripheryParams } from '../types';
import { scale } from '../../common/math/scale';
import { getDefaultSqrtPriceLimit } from '../../common/math/getDefaultSqrtPriceLimits';
import { TRADER_TICK_LOWER, TRADER_TICK_UPPER } from '../../common/constants';
import {
  decodeInfoPostSwap,
  RawInfoPostSwap,
} from '../../common/errors/errorHandling';
import { getPeripheryContract } from '../../common/contract-generators';
import { BigNumber, providers } from 'ethers';
import { descale } from '../../common/math/descale';

export type GetAvailableNotionalArgs = {
  isFixedTaker: boolean;
  marginEngineAddress: string;
  tokenDecimals: number;
  peripheryAddress: string;
  provider: providers.Provider;
};

export const getAvailableNotional = async ({
  isFixedTaker,
  marginEngineAddress,
  tokenDecimals,
  peripheryAddress,
  provider,
}: GetAvailableNotionalArgs): Promise<number> => {
  const peripheryContract = getPeripheryContract(peripheryAddress, provider);

  const swapPeripheryParamsLargeSwap: SwapPeripheryParams = {
    marginEngineAddress,
    isFT: isFixedTaker,
    notional: scale(1000000000000000, tokenDecimals),
    sqrtPriceLimitX96: getDefaultSqrtPriceLimit(isFixedTaker),
    tickLower: TRADER_TICK_LOWER,
    tickUpper: TRADER_TICK_UPPER,
    marginDelta: '0',
  };

  let availableNotional = BigNumber.from(0);

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

  return descale(availableNotional.abs(), tokenDecimals);
};
