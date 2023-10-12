import { MarginAccount } from '../getMarginAccounts';
import { Tokens } from '../../types';

export type GetAvailableAmountsToWithdrawForMarginAccountArgs = {
  id: MarginAccount['id'];
};

export type AvailableAmountToWithdrawForMarginAccount = {
  value: number;
  valueUSD: number;
  token: Tokens;
};

export type GetAvailableAmountsToWithdrawForMarginAccountResponse =
  AvailableAmountToWithdrawForMarginAccount[];
