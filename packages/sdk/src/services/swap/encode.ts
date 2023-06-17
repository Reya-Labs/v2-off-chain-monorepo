import { createAccountId } from '../../utils/helpers';
import { MethodParameters, MultiAction } from '../../utils/types';
import {
  encodeDeposit,
  encodeRouterCall,
  encodeSingleCreateAccount,
  encodeSingleSwap,
} from '../encode';
import { SwapPeripheryParameters } from './types';

export async function encodeSwap(
  trade: SwapPeripheryParameters,
  accountId?: string,
): Promise<MethodParameters> {
  const multiAction = new MultiAction();

  if (accountId === undefined) {
    const ownerAddress = await trade.owner.getAddress();
    // open account
    accountId = await createAccountId({
      ownerAddress,
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
    trade.fixedRateLimit,
    multiAction,
  );

  if (trade.baseAmount) {
    // swap
    encodeSingleSwap(
      accountId,
      trade.marketId,
      trade.maturityTimestamp,
      trade.baseAmount,
      trade.fixedRateLimit,
      multiAction,
    );
  }

  return encodeRouterCall(multiAction, ethAmount);
}
