import { GetPoolLpInfoArgs, GetPoolLpInfoResults } from './types';

export const getPoolLpInfo = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: GetPoolLpInfoArgs,
): Promise<GetPoolLpInfoResults> => {
  return {
    maxLeverage: Number.MAX_SAFE_INTEGER,
  };
};
