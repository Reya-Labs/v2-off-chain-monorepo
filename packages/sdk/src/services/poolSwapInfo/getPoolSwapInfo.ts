import { GetPoolSwapInfoArgs, GetPoolSwapInfoResults } from './types';

export const getPoolSwapInfo = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: GetPoolSwapInfoArgs,
): Promise<GetPoolSwapInfoResults> => {
  return {
    availableNotionalFixedTaker: 1000000000,
    availableNotionalVariableTaker: 1000000000,
    maxLeverageFixedTaker: 1,
    maxLeverageVariableTaker: 1,
  };
};
