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
      isLp: true,
      tickLower: trade.tickLower,
      tickUpper: trade.tickUpper,
    });

    console.log('accountId:', accountId.toString());
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
