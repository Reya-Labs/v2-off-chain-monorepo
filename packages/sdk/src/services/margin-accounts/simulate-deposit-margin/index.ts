/* eslint-disable @typescript-eslint/no-unused-vars */
import { getRandomIntInclusive, randomHealth } from './mocks';

export type SimulateDepositMarginArgs = {
  marginAccountId: string;
  amount: number;
  token: 'dai' | 'eth' | 'reth' | 'steth' | 'usdc' | 'usdt';
};

export type SimulateDepositMarginReturnType = {
  marginRatioPercentage: number;
  marginRatioHealth: 'danger' | 'healthy' | 'warning';
  gasFeeUSD: number;
};

export const simulateDepositMargin = async ({
  marginAccountId,
  amount,
  token,
}: SimulateDepositMarginArgs): Promise<SimulateDepositMarginReturnType> => {
  await new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 100 + 1000);
  });
  return {
    marginRatioPercentage: getRandomIntInclusive(2, 99),
    marginRatioHealth: randomHealth(),
    gasFeeUSD: getRandomIntInclusive(2, 99) + Math.random(),
  };
};
