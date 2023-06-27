import { GetAvailableNotionalArgs } from './types';

export const getAvailableNotional = async ({
  isFT,
  chainId,
  params,
}: GetAvailableNotionalArgs): Promise<number> => {
  return Promise.resolve(1000000000);
};
