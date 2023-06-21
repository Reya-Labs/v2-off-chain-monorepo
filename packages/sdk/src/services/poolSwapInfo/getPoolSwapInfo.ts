import { createSwapParams } from '../swap';
import { GetPoolSwapInfoArgs, GetPoolSwapInfoResults } from './types';
import { getPoolSwapInfoOneSide } from './getPoolSwapInfoOneSide';
import { getDummyWallet } from '../../utils/getDummyWallet';

export const getPoolSwapInfo = async ({
  ammId,
  provider,
}: GetPoolSwapInfoArgs): Promise<GetPoolSwapInfoResults> => {
  const chainId = (await provider.getNetwork()).chainId;

  const dummyWallet = await getDummyWallet().connect(provider);
  const params = await createSwapParams({
    ammId,
    signer: dummyWallet,
    notional: 0,
    margin: 0,
    fixedRateLimit: 0,
  });

  try {
    const {
      availableNotional: availableNotionalFixedTaker,
      maxLeverage: maxLeverageFixedTaker,
    } = await getPoolSwapInfoOneSide({
      isFT: true,
      params,
      chainId,
    });

    const {
      availableNotional: availableNotionalVariableTaker,
      maxLeverage: maxLeverageVariableTaker,
    } = await getPoolSwapInfoOneSide({
      isFT: false,
      params,
      chainId,
    });

    const result: GetPoolSwapInfoResults = {
      availableNotionalFixedTaker,
      availableNotionalVariableTaker,
      maxLeverageFixedTaker,
      maxLeverageVariableTaker,
    };

    return result;
  } catch (error) {
    console.warn('Failed to get Pool Swap Info');
    return {
      availableNotionalFixedTaker: 0,
      availableNotionalVariableTaker: 0,
      maxLeverageFixedTaker: 0,
      maxLeverageVariableTaker: 0,
    };
  }
};
