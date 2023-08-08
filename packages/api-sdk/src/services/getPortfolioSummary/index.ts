/* eslint-disable @typescript-eslint/no-unused-vars */
import { getPortfolioSummaryMock } from './mocks';

export type GetPortfolioSummaryArgs = {
  chainIds: number[];
  ownerAddress: string;
};
export const getPortfolioSummary = async ({
  chainIds,
  ownerAddress,
}: GetPortfolioSummaryArgs) => {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  return getPortfolioSummaryMock();
};
