import { GetPoolSwapInfoArgs } from '../types';
import { getSentryTracker } from '../../init';
import { getPoolSwapInfoOneSide } from './getPoolSwapInfoOneSide';
import { AMMInfo } from '../../common/api/amm/types';
import { getAmmInfo } from '../../common/api/amm/getAmmInfo';
import { PERIPHERY_ADDRESS_BY_CHAIN_ID } from '../../common/constants';

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
  const chainId = (await provider.getNetwork()).chainId;

  const peripheryAddress = PERIPHERY_ADDRESS_BY_CHAIN_ID[chainId];

  const ammInfo: AMMInfo = await getAmmInfo(ammId, chainId);

  try {
    const {
      availableNotional: availableNotionalFixedTaker,
      maxLeverage: maxLeverageFixedTaker,
    } = await getPoolSwapInfoOneSide({
      isFixedTaker: true,
      peripheryAddress,
      marginEngineAddress: ammInfo.marginEngineAddress,
      tokenDecimals: ammInfo.underlyingTokenDecimals,
      provider,
    });

    const {
      availableNotional: availableNotionalVariableTaker,
      maxLeverage: maxLeverageVariableTaker,
    } = await getPoolSwapInfoOneSide({
      isFixedTaker: false,
      peripheryAddress,
      marginEngineAddress: ammInfo.marginEngineAddress,
      tokenDecimals: ammInfo.underlyingTokenDecimals,
      provider,
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
