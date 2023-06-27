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
    trade.isETH,
    trade.margin,
    trade.liquidatorBooster,
    multiAction,
  );

  return encodeRouterCall(multiAction, ethAmount);
}
