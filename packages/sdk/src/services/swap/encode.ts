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
  liquidatorBooster,
  isETH,
}: EncodeSwapArgs): MethodParameters & {
  swapActionPosition: number;
} {
  const multiAction = new MultiAction();
  let ethAmount = ZERO_BN;

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
  if (margin.gt(0)) {
    ethAmount = encodeDeposit(
      accountId,
      quoteTokenAddress,
      isETH,
      margin,
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
  if (margin.lt(0)) {
    encodeDeposit(
      accountId,
      quoteTokenAddress,
      isETH,
      margin,
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
