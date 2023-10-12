import { SupportedChainId } from '@voltz-protocol/commons-v2';
import { Tokens } from '../../types';

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
  // if settlementToken is present the balance should be that token
  // if settlementToken is null then balance is same as balanceUSD
  balance: number;
  balanceUSD: number;
  positionsCount: number;
  marginRatioPercentage: number;
  marginRatioHealth: MarginRatioHealth;
  initialMarginPreTrade: number;
  // nullable until first swap/lp is done
  settlementToken?: Tokens | null;
};

export type GetMarginAccountsResponse = {
  marginAccounts: MarginAccount[];
  totalMarginAccounts: number;
};
