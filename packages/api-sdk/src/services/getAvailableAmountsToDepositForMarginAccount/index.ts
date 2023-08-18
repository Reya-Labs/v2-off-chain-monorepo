/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  GetAvailableAmountsToDepositForMarginAccountArgs,
  GetAvailableAmountsToDepositForMarginAccountResponse,
} from './types';
import { generateRandomMockResponse } from './mocks';

export * from './types';

export const getAvailableAmountsToDepositForMarginAccount = async ({
  id,
}: GetAvailableAmountsToDepositForMarginAccountArgs): Promise<GetAvailableAmountsToDepositForMarginAccountResponse> => {
  await new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 100 + 1000);
  });

  return generateRandomMockResponse();
};
