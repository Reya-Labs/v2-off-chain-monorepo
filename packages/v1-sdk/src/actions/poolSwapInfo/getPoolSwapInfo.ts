import { GetPoolSwapInfoArgs } from '../types';
import { getSentryTracker } from '../../init';
import { getPoolSwapInfoOneSide } from './getPoolSwapInfoOneSide';

export type SimulateMaxSwapResults = {
  availableNotionalFixedTaker: number;
  availableNotionalVariableTaker: number;
  maxLeverageFixedTaker: number;
  maxLeverageVariableTaker: number;
};

export const getPoolSwapInfo = async ({
  ammId,
  provider,
}: GetPoolSwapInfoArgs): Promise<SimulateMaxSwapResults> => {
  try {
    const {
      availableNotional: availableNotionalFixedTaker,
      maxLeverage: maxLeverageFixedTaker,
    } = await getPoolSwapInfoOneSide({
      isFixedTaker: true,
    });

    const {
      availableNotional: availableNotionalVariableTaker,
      maxLeverage: maxLeverageVariableTaker,
    } = await getPoolSwapInfoOneSide({
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
