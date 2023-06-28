import { GetAvailableNotionalArgs } from './types';

export const getAvailableNotional = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: GetAvailableNotionalArgs,
): Promise<number> => {
  return Promise.resolve(1000000000);
};
