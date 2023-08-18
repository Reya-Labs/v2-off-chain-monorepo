import { MarginAccount } from '../getMarginAccounts';

export type GetAvailableAmountsToDepositForMarginAccountArgs = {
  id: MarginAccount['id'];
};

export type AvailableAmountToDepositForMarginAccount = {
  value: number;
  valueUSD: number;
  token: 'dai' | 'eth' | 'reth' | 'steth' | 'usdc' | 'usdt';
};

export type GetAvailableAmountsToDepositForMarginAccountResponse =
  AvailableAmountToDepositForMarginAccount[];
