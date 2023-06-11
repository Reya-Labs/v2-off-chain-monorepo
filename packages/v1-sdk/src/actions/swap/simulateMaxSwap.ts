import { SimulateMaxSwapArgs, SwapPeripheryParams } from '../types';
import { getSentryTracker } from '../../init';
import { getPeripheryContract } from '../../common/contract-generators';
import { providers } from 'ethers';
import { scale } from '../../common/math/scale';
import { TRADER_TICK_LOWER, TRADER_TICK_UPPER } from '../../common/constants';
import { getDefaultSqrtPriceLimit } from '../../common/math/getDefaultSqrtPriceLimits';
import {
  decodeInfoPostSwap,
  RawInfoPostSwap,
} from '../../common/errors/errorHandling';

export type SimulateMaxSwapResults = {
  availableNotionalFixedTaker: number;
  availableNotionalVariableTaker: number;
  maxLeverageFixedTaker: number;
  maxLeverageVariableTaker: number;
};

export type SimulateMaxSwapOneSideResults = {
  availableNotional: number;
  maxLeverage: number;
};

export type SimulateMaxSwapOneSideArgs = {
  isFixedTaker: boolean;
  peripheryAddress: string;
  marginEngineAddress: string;
  tokenDecimals: number;
  provider: providers.Provider;
};

export const simulateMaxSwapOneSide = async ({
  isFixedTaker,
  peripheryAddress,
  marginEngineAddress,
  tokenDecimals,
  provider,
}: SimulateMaxSwapOneSideArgs): Promise<SimulateMaxSwapOneSideResults> => {
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
        const availableNotional = result[1];
      },
      (error: any) => {
        const result: RawInfoPostSwap = decodeInfoPostSwap(error);
        const availableNotional = result.availableNotional;
      },
    );

  // await peripheryContract.callStatic.swap(swapPeripheryParamsLargeSwap).then(
  //   (result: any) => {
  //     availableNotional = result[1];
  //   },
  //   (error: any) => {
  //     const result = decodeInfoPostSwap(error);
  //     availableNotional = result.availableNotional;
  //   },
  // );
};

export const simulateMaxSwap = async ({
  ammId,
  provider,
}: SimulateMaxSwapArgs): Promise<SimulateMaxSwapResults> => {
  try {
    const {
      availableNotional: availableNotionalFixedTaker,
      maxLeverage: maxLeverageFixedTaker,
    } = await simulateMaxSwapOneSide({
      isFixedTaker: true,
    });

    const {
      availableNotional: availableNotionalVariableTaker,
      maxLeverage: maxLeverageVariableTaker,
    } = await simulateMaxSwapOneSide({
      isFixedTaker: false,
    });

    const result: SimulateMaxSwapResults = {
      availableNotionalFixedTaker,
      availableNotionalVariableTaker,
      maxLeverageFixedTaker,
      maxLeverageVariableTaker,
    };

    return result;
  } catch (error) {
    const sentryTracker = getSentryTracker();
    sentryTracker.captureException(error);
    sentryTracker.captureMessage(
      'Unable to retrieve available notional in VT direction',
    );
    return {
      availableNotionalFixedTaker: 0,
      availableNotionalVariableTaker: 0,
      maxLeverageFixedTaker: 0,
      maxLeverageVariableTaker: 0,
    };
  }
};
