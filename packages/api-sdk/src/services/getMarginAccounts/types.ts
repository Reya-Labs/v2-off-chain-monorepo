import { SupportedChainId } from '@voltz-protocol/commons-v2';

export type MarginAccountsSortBy =
  | 'balance'
  | 'marginRatio'
  | 'positionsLength';
export type SortDirection = 'noSort' | 'ascending' | 'descending';

export type GetMarginAccountsArgs = {
  chainIds: number[];
  ownerAddress: string;
  sort: {
    id: MarginAccountsSortBy;
    direction: SortDirection;
  };
  page: number;
  perPage: number;
};

export type MarginRatioHealth = 'healthy' | 'danger' | 'warning';

export type MarginAccount = {
  id: string;
  chainId: SupportedChainId;
  name: string;
  balance: number;
  balanceUSD: number;
  positionsCount: number;
  marginRatioPercentage: number;
  marginRatioHealth: MarginRatioHealth;
  initialMarginPreTrade: number;
};

export type GetMarginAccountsResponse = {
  marginAccounts: MarginAccount[];
  totalMarginAccounts: number;
};
