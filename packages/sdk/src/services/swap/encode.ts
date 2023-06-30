import { createAccountId } from '../../utils/helpers';
import { MethodParameters, MultiAction } from '../../utils/types';
import {
  encodeDeposit,
  encodeRouterCall,
  encodeSingleCreateAccount,
  encodeSingleSwap,
} from '../encode';
import { SwapPeripheryParameters } from './types';

export function encodeSwap(
  trade: SwapPeripheryParameters,
  accountId?: string,
): MethodParameters {
  const multiAction = new MultiAction();

  if (accountId === undefined) {
    // open account
    accountId = createAccountId({
      ownerAddress: trade.ownerAddress,
      productAddress: trade.productAddress,
      marketId: trade.marketId,
      maturityTimestamp: trade.maturityTimestamp,
      isLp: false,
    });
    encodeSingleCreateAccount(accountId, multiAction);
  }

  // deposit
  const ethAmount = encodeDeposit(
    accountId,
    trade.quoteTokenAddress,
    trade.isETH,
    trade.margin,
    trade.liquidatorBooster,
    multiAction,
  );

  if (trade.baseAmount) {
    // swap
    encodeSingleSwap(
      accountId,
      trade.marketId,
      trade.maturityTimestamp,
      trade.baseAmount,
      multiAction,
    );
  }

  return encodeRouterCall(multiAction, ethAmount);
}
