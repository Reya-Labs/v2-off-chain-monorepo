/* eslint-disable @typescript-eslint/no-unused-vars */
import { getPositionsMock } from './mocks';
import { MarginAccount } from '../getMarginAccounts';
import { V1V2PortfolioPosition } from '../../types';

export type GetMarginAccountPositionsArgs = {
  id: MarginAccount['id'];
  page?: number;
  perPage?: number;
};

export const getMarginAccountPositions = async ({
  id,
  page,
  perPage,
}: GetMarginAccountPositionsArgs): Promise<V1V2PortfolioPosition[]> => {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  return getPositionsMock(id, perPage) as never;
};
