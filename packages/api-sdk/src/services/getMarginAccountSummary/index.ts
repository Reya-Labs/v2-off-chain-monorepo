/* eslint-disable @typescript-eslint/no-unused-vars */
import { getMarginAccountSummaryMock } from './mocks';
import { MarginAccount } from '../getMarginAccounts';

export type GetMarginAccountSummaryParams = {
  marginAccountId: MarginAccount['id'];
  ownerAddress: string;
};
export const getMarginAccountSummary = async ({
  marginAccountId,
  ownerAddress,
}: GetMarginAccountSummaryParams) => {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  return getMarginAccountSummaryMock(marginAccountId);
};
