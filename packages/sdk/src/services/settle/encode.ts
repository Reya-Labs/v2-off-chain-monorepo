import { ZERO_BN } from '../../utils/constants';
import { MethodParameters, MultiAction } from '../../utils/types';
import {
  encodeRouterCall,
  encodeSingleSettle,
  encodeSingleWithdraw,
} from '../encode';
import { SettleParameters } from './types';

export function encodeSettlement(trade: SettleParameters): MethodParameters {
  const multiAction = new MultiAction();

  // settle
  encodeSingleSettle(
    trade.accountId,
    trade.marketId,
    trade.maturityTimestamp,
    multiAction,
  );
  // withdraw
  encodeSingleWithdraw(
    trade.accountId,
    trade.quoteTokenAddress,
    trade.marginAmount,
    multiAction,
  );

  return encodeRouterCall(multiAction, ZERO_BN);
}
