/* eslint-disable @typescript-eslint/no-unused-vars */
import { getRandomIntInclusive, randomHealth } from './mocks';
import { BasePool } from '@voltz-protocol/api-sdk-v2';

export type SimulateWithdrawMarginArgs = {
  marginAccountId: string;
  amount: number;
  token: BasePool['underlyingToken']['name'];
};

export type SimulateWithdrawMarginReturnType = {
  marginRatioPercentage: number;
  marginRatioHealth: 'danger' | 'healthy' | 'warning';
  gasFeeUSD: number;
  gasFee: number;
};

export const simulateWithdrawMargin = async ({
  marginAccountId,
  amount,
  token,
}: SimulateWithdrawMarginArgs): Promise<SimulateWithdrawMarginReturnType> => {
  await new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 100 + 1000);
  });
  return {
    marginRatioPercentage: getRandomIntInclusive(2, 99),
    marginRatioHealth: randomHealth(),
    gasFeeUSD: getRandomIntInclusive(2, 99) + Math.random(),
    gasFee: getRandomIntInclusive(2, 99) + Math.random(),
  };
};
