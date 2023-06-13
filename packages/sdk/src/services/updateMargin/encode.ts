import { createAccountId } from '../../utils/helpers';
import { MethodParameters, MultiAction } from '../../utils/types';
import { encodeDeposit, encodeRouterCall } from '../encode';
import { UpdateMarginParams } from './types';

export function encodeUpdateMargin(
  trade: UpdateMarginParams,
): MethodParameters {
  const multiAction = new MultiAction();

  // deposit
  const ethAmount = encodeDeposit(
    trade.accountId,
    trade.quoteTokenAddress,
    trade.margin,
    multiAction,
  );

  return encodeRouterCall(multiAction, ethAmount);
}
