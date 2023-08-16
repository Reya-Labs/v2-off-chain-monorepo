/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  GetAvailableAmountsToWithdrawForMarginAccountArgs,
  GetAvailableAmountsToWithdrawForMarginAccountResponse,
} from './types';
import { generateRandomMockResponse } from './mocks';

export * from './types';

export const getAvailableAmountsToWithdrawForMarginAccount = async ({
  id,
}: GetAvailableAmountsToWithdrawForMarginAccountArgs): Promise<GetAvailableAmountsToWithdrawForMarginAccountResponse> => {
  await new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 100 + 1000);
  });

  return generateRandomMockResponse();
};
