import { createAccountId } from '../../utils/helpers';
import { MethodParameters, MultiAction } from '../../utils/types';
import {
  encodeDeposit,
  encodeRouterCall,
  encodeSingleCreateAccount,
  encodeSingleMakerOrder,
} from '../encode';
import { LpPeripheryParameters } from './types';

export function encodeLp(
  trade: LpPeripheryParameters,
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
      isLp: true,
      tickLower: trade.tickLower,
      tickUpper: trade.tickUpper,
    });

    console.log('LP account id:', accountId.toString());
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

  if (trade.liquidityAmount) {
    // lp
    encodeSingleMakerOrder(
      accountId,
      trade.marketId,
      trade.maturityTimestamp,
      trade.tickLower,
      trade.tickUpper,
      trade.liquidityAmount,
      multiAction,
    );
  }

  const call = encodeRouterCall(multiAction, ethAmount);

  return call;
}
