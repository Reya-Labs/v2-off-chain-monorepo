/* eslint-disable @typescript-eslint/no-unused-vars */
import { providers } from 'ethers';

export type CreateMarginAccountArgs = {
  signer: providers.JsonRpcSigner | null;
  name: string;
};
export const createMarginAccount = async ({
  name,
  signer,
}: CreateMarginAccountArgs) => {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      const num = Math.random() * 100;
      if (num > 50) {
        reject(new Error('Random error happened. Chance is 50-50 try again!'));
        return;
      }

      resolve(true);
    }, 1000);
  });
};
