/* eslint-disable @typescript-eslint/no-unused-vars */
import { mockedMarginAccounts } from './mocks';
import { GetMarginAccountsArgs, GetMarginAccountsResponse } from './types';

export * from './types';

export const getMarginAccounts = async ({
  chainIds,
  sort,
  ownerAddress,
  page,
  perPage,
}: GetMarginAccountsArgs): Promise<GetMarginAccountsResponse> => {
  await new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 100 + 1000);
  });
  const marginAccounts = mockedMarginAccounts.slice(
    page * perPage,
    page * perPage + perPage,
  );

  return {
    marginAccounts,
    totalMarginAccounts: mockedMarginAccounts.length,
  };
};
