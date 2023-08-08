import { getPositionsMock } from './mocks';
import { MarginAccount } from '../getMarginAccounts';
import { V1V2PortfolioPosition } from '@voltz-protocol/api-sdk-v2';

export type GetMarginAccountPositionsArgs = { id: MarginAccount['id'] };

export const getMarginAccountPositions = async ({
  id,
}: GetMarginAccountPositionsArgs): Promise<V1V2PortfolioPosition> => {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
  return getPositionsMock();
};
