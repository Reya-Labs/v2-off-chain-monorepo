import { createAccountId } from '../../utils/helpers';
import { MethodParameters, MultiAction } from '../../utils/types';
import {
  encodeDeposit,
  encodeRouterCall,
  encodeSingleCreateAccount,
  encodeSingleMakerOrder,
} from '../encode';
import { ZERO_BN } from '../../utils/constants';
import { EncodeLpArgs } from './types';

export function encodeLp({
  productAddress,
  marketId,
  maturityTimestamp,
  quoteTokenAddress,

  accountId,
  ownerAddress,
  tickLower,
  tickUpper,

  liquidityAmount,

  margin,
  fee,
  liquidatorBooster,
  isETH,
}: EncodeLpArgs): MethodParameters & {
  lpActionPosition: number;
} {
  const multiAction = new MultiAction();
  let ethAmount = ZERO_BN;

  // If deposit margin, pay fees from wallet
  // Otherwise, if withdraw, pay fees from margin account
  const tokenTransfer = margin.gte(0) ? margin.add(fee) : margin;

  if (accountId === undefined) {
    // Open account

    accountId = createAccountId({
      ownerAddress,
      productAddress,
      marketId,
      maturityTimestamp,
      isLp: true,
      tickLower,
      tickUpper,
    });

    encodeSingleCreateAccount(accountId, multiAction);
  }

  // If deposit, do it before LP
  if (tokenTransfer.gt(0) || liquidatorBooster.gt(0)) {
    ethAmount = encodeDeposit(
      accountId,
      quoteTokenAddress,
      isETH,
      tokenTransfer,
      liquidatorBooster,
      multiAction,
    );
  }

  // LP

  // Store the index of LP command to know what result to decode later
  const lpActionPosition = multiAction.length;

  encodeSingleMakerOrder(
    accountId,
    marketId,
    maturityTimestamp,
    tickLower,
    tickUpper,
    liquidityAmount,
    multiAction,
  );

  // If withdrawal, do it after LP
  if (tokenTransfer.lt(0)) {
    encodeDeposit(
      accountId,
      quoteTokenAddress,
      isETH,
      tokenTransfer,
      liquidatorBooster,
      multiAction,
    );
  }

  const call = encodeRouterCall(multiAction, ethAmount);

  return {
    ...call,
    lpActionPosition,
  };
}
