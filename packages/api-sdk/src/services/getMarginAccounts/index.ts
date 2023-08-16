/* eslint-disable @typescript-eslint/no-unused-vars */
import { mockedMarginAccounts } from './mocks';
import {
  GetMarginAccountsArgs,
  GetMarginAccountsResponse,
  MarginAccount,
} from './types';

export * from './types';

function sortMarginAccounts(
  a: MarginAccount,
  b: MarginAccount,
  sort: GetMarginAccountsArgs['sort'],
) {
  if (sort.id === 'balance') {
    if (sort.direction === 'noSort') {
      return 0;
    } else if (sort.direction === 'ascending') {
      return a.balance - b.balance;
    } else {
      return b.balance - a.balance;
    }
  } else if (sort.id === 'marginRatio') {
    if (sort.direction === 'noSort') {
      return 0;
    } else if (sort.direction === 'ascending') {
      return a.marginRatioPercentage - b.marginRatioPercentage;
    } else {
      return b.marginRatioPercentage - a.marginRatioPercentage;
    }
  } else if (sort.id === 'positionsLength') {
    if (sort.direction === 'noSort') {
      return 0;
    } else if (sort.direction === 'ascending') {
      return a.positionsCount - b.positionsCount;
    } else {
      return b.positionsCount - a.positionsCount;
    }
  } else {
    // Default case: no sorting
    return 0;
  }
}

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
  const marginAccounts = mockedMarginAccounts
    .slice()
    .sort((a, b) => sortMarginAccounts(a, b, sort))
    .slice(page * perPage, page * perPage + perPage);

  return {
    marginAccounts,
    totalMarginAccounts: mockedMarginAccounts.length,
  };
};
