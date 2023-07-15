import { ZERO_BN } from '../../utils/constants';
import { createAccountId } from '../../utils/helpers';
import { MethodParameters, MultiAction } from '../../utils/types';
import {
  encodeDeposit,
  encodeRouterCall,
  encodeSingleCreateAccount,
  encodeSingleSwap,
} from '../encode';
import { EncodeSwapArgs } from './types';

export function encodeSwap({
  productAddress,
  marketId,
  maturityTimestamp,
  quoteTokenAddress,

  accountId,
  ownerAddress,

  baseAmount,

  margin,
  fee,
  liquidatorBooster,
  isETH,
}: EncodeSwapArgs): MethodParameters & {
  swapActionPosition: number;
} {
  const multiAction = new MultiAction();
  let ethAmount = ZERO_BN;

  // If deposit margin, pay fees from wallet
  // Otherwise, if withdraw, pay fees from margin account
  const tokenTransfer = margin.gte(0) ? margin.add(fee) : margin;

  if (accountId === undefined) {
    // Open account

    accountId = createAccountId({
      ownerAddress: ownerAddress,
      productAddress: productAddress,
      marketId: marketId,
      maturityTimestamp: maturityTimestamp,
      isLp: false,
    });

    encodeSingleCreateAccount(accountId, multiAction);
  }

  // If deposit, do it before swap
  if (tokenTransfer.gt(0)) {
    ethAmount = encodeDeposit(
      accountId,
      quoteTokenAddress,
      isETH,
      tokenTransfer,
      liquidatorBooster,
      multiAction,
    );
  }

  // Store the index of LP command to know what result to decode later
  const swapActionPosition = multiAction.length;

  // swap
  encodeSingleSwap(
    accountId,
    marketId,
    maturityTimestamp,
    baseAmount,
    multiAction,
  );

  // If withdrawal, do it after swap
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
    swapActionPosition,
  };
}
