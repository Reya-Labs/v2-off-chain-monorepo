import { MarginAccount } from '../getMarginAccounts';

export type GetAvailableAmountsToWithdrawForMarginAccountArgs = {
  id: MarginAccount['id'];
};

export type AvailableAmountToWithdrawForMarginAccount = {
  value: number;
  valueUSD: number;
  token: 'dai' | 'eth' | 'reth' | 'steth' | 'usdc' | 'usdt';
};

export type GetAvailableAmountsToWithdrawForMarginAccountResponse =
  AvailableAmountToWithdrawForMarginAccount[];
