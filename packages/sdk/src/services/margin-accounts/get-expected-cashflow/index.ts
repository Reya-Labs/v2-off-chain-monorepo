/* eslint-disable @typescript-eslint/no-unused-vars */

export type GetExpectedCashflowResult = {
  additionalCashflowUSD: number;
  totalCashflowUSD: number;
};

function mockExpectedCashflowResult(): GetExpectedCashflowResult {
  const randomValue = () => Math.random() * 1000;

  return {
    additionalCashflowUSD: randomValue(),
    totalCashflowUSD: randomValue(),
  };
}

export type GetExpectedCashflowArgs = {
  poolId: number;
  marginAccountId: number;
  estimatedVariableApy: number;
};

export const getExpectedCashflow = async ({
  poolId,
  marginAccountId,
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
