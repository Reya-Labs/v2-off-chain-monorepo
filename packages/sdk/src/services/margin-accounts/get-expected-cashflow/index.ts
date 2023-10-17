/* eslint-disable @typescript-eslint/no-unused-vars */

export type GetExpectedCashflowResult = {
  // should be in pool underlying token
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
};

export const getExpectedCashflow = async ({
  poolId,
  estimatedVariableApy,
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
