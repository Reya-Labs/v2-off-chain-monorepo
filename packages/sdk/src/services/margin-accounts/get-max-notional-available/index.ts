/* eslint-disable @typescript-eslint/no-unused-vars */
export type GetMaxNotionalPossibleArgs = {
  poolId: string;
  marginAccountId: string;
  mode: 'fixed' | 'variable';
};

export const getMaxNotionalAvailable = async ({
  poolId,
  marginAccountId,
  mode,
}: GetMaxNotionalPossibleArgs): Promise<number> => {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      const num = Math.random() * 100;
      if (num > 50) {
        reject(new Error('Random error happened. Chance is 50-50 try again!'));
        return;
      }

      resolve(Math.random() * 10000 + 1000);
    }, Math.random() * 100 + 1000);
  });
};
