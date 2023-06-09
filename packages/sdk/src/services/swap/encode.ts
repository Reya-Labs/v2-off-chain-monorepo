import { createAccountId } from '../../utils/helpers';
import { MethodParameters, MultiAction } from '../../utils/types';
import {
  encodeDeposit,
  encodeRouterCall,
  encodeSingleCreateAccount,
  encodeSingleSwap,
} from '../encode';
import { SwapParameters } from './types';

export async function encodeSwap(
  trade: SwapParameters,
): Promise<MethodParameters> {
  const multiAction = new MultiAction();

  const ownerAddress = await trade.owner.getAddress();
  // open account
  const accountId = await createAccountId({
    ownerAddress,
    productAddress: trade.productAddress,
    marketId: trade.marketId,
    maturityTimestamp: trade.maturityTimestamp,
    isLp: false,
  });
  encodeSingleCreateAccount(accountId, multiAction);

  // deposit
  const ethAmount = encodeDeposit(
    accountId,
    trade.quoteTokenAddress,
    trade.marginAmount,
    multiAction,
  );

  if (trade.baseAmount) {
    // swap
    encodeSingleSwap(
      accountId,
      trade.marketId,
      trade.maturityTimestamp,
      trade.baseAmount,
      trade.priceLimit,
      multiAction,
    );
  }

  return encodeRouterCall(multiAction, ethAmount);
}
