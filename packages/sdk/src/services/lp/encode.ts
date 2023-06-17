import { createAccountId } from '../../utils/helpers';
import { MethodParameters, MultiAction } from '../../utils/types';
import {
  encodeDeposit,
  encodeRouterCall,
  encodeSingleCreateAccount,
  encodeSingleMakerOrder,
} from '../encode';
import { LpPeripheryParameters } from './types';

export async function encodeLp(
  trade: LpPeripheryParameters,
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
    trade.margin,
    multiAction,
  );

  if (trade.liquidityAmount) {
    // swap
    encodeSingleMakerOrder(
      accountId,
      trade.marketId,
      trade.maturityTimestamp,
      trade.fixedLow,
      trade.fixedHigh,
      trade.liquidityAmount,
      multiAction,
    );
  }

  return encodeRouterCall(multiAction, ethAmount);
}
