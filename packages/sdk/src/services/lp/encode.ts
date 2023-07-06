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
  liquidatorBooster,
  isETH,
}: EncodeLpArgs): MethodParameters & {
  lpActionPosition: number;
} {
  const multiAction = new MultiAction();
  let ethAmount = ZERO_BN;

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
    lpActionPosition,
  };
}
