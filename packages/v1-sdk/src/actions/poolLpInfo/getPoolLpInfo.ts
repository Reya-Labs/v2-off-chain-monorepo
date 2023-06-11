import { GetPoolLpInfoArgs } from '../types';

export type GetPoolLpInfoResults = {
  maxLeverage: number;
};

export const getPoolLpInfo = async ({
  ammId,
  fixedHigh,
  fixedLow,
  provider,
}: GetPoolLpInfoArgs): Promise<GetPoolLpInfoResults> => {

};
