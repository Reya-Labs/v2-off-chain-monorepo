/* eslint-disable @typescript-eslint/no-unused-vars */
import { GetTokenAllowanceForPeripheryArgs } from './types';

export const getTokenAllowanceForPeriphery = async ({
  tokenName,
  signer,
}: GetTokenAllowanceForPeripheryArgs): Promise<number> => {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      const num = Math.random() * 100;
      if (num > 50) {
        reject(new Error('Random error happened. Chance is 50-50 try again!'));
        return;
      }

      resolve(tokenName === 'eth' ? Number.MAX_SAFE_INTEGER : 0);
    }, 1000);
  });
};
