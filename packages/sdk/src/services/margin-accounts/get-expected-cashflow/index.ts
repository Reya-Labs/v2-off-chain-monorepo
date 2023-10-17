/* eslint-disable @typescript-eslint/no-unused-vars */

import { Tokens } from '@voltz-protocol/api-sdk-v2';

export type GetExpectedCashflowResult = {
  totalCashflow: number;
};

function mockExpectedCashflowResult(): GetExpectedCashflowResult {
  const randomValue = () => Math.random() * 1000;

  return {
    totalCashflow: randomValue(),
  };
}

export type GetExpectedCashflowArgs = {
  poolId: string;
  estimatedVariableApy: number;
  token: Tokens | '$';
};

export const getExpectedCashflow = async ({
  poolId,
  estimatedVariableApy,
  token,
}: GetExpectedCashflowArgs): Promise<GetExpectedCashflowResult> => {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      const num = Math.random() * 100;
      if (num > 50) {
        reject(new Error('Random error happened. Chance is 50-50 try again!'));
        return;
      }

      resolve(mockExpectedCashflowResult());
    }, 1000);
  });
};
