import { MarginAccount } from '../getMarginAccounts';
import { Tokens } from '../../types';

export type GetAvailableAmountsToDepositForMarginAccountArgs = {
  id: MarginAccount['id'];
};

export type AvailableAmountToDepositForMarginAccount = {
  value: number;
  valueUSD: number;
  token: Tokens;
};

export type GetAvailableAmountsToDepositForMarginAccountResponse =
  AvailableAmountToDepositForMarginAccount[];
