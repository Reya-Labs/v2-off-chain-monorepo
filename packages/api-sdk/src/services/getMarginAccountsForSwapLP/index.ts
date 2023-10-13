/* eslint-disable @typescript-eslint/no-unused-vars */
import { mockedMarginAccounts } from './mocks';
import {
  GetMarginAccountsForSwapLPArgs,
  GetMarginAccountsForSwapLPResponse,
} from './types';

export * from './types';

export const getMarginAccountsForSwapLP = async ({
  chainIds,
  poolId,
  ownerAddress,
}: GetMarginAccountsForSwapLPArgs): Promise<GetMarginAccountsForSwapLPResponse> => {
  await new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 100 + 1000);
  });

  return {
    marginAccounts: mockedMarginAccounts,
  };
};
