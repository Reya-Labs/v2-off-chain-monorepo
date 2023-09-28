/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApproveTokenPeripheryArgs } from './types';

export const approveTokenForPeriphery = async ({
  tokenName,
  signer,
}: ApproveTokenPeripheryArgs): Promise<number> => {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      const num = Math.random() * 100;
      if (num > 50) {
        reject(new Error('Random error happened. Chance is 50-50 try again!'));
        return;
      }

      resolve(tokenName === 'eth' ? Number.MAX_SAFE_INTEGER : 10000);
    }, 1000);
  });
};
