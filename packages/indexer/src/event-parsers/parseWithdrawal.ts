import { BigNumber, Event } from 'ethers';

import { parseBaseEvent } from './utils/parseBaseEvent';
import {
  DepositedWithdrawnEvent,
  ProtocolEventType,
} from '@voltz-protocol/bigquery-v2';
import { convertToAddress, getTokenDetails } from '@voltz-protocol/commons-v2';

export const parseWithdrawal = (
  chainId: number,
  event: Event,
): DepositedWithdrawnEvent => {
  // 1. Type of event
  const type = ProtocolEventType.DepositedWithdrawn;

  // 2. Parse particular args
  const accountId = (event.args?.accountId as BigNumber).toString();
  const collateralType = event.args?.collateralType as string;

  const { tokenDescaler } = getTokenDetails(collateralType);

  const tokenAmount = tokenDescaler(event.args?.tokenAmount as BigNumber);

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    accountId,
    collateralType: convertToAddress(collateralType),
    tokenAmount: -tokenAmount,
  };
};
