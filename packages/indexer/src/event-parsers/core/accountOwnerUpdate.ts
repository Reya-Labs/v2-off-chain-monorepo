import { Event, BigNumber } from 'ethers';

import { parseBaseEvent } from '../utils/baseEvent';
import {
  convertLowercaseString,
  AccountOwnerUpdateEvent,
} from '@voltz-protocol/commons-v2';

export const parseAccountOwnerUpdate = (
  chainId: number,
  event: Event,
): AccountOwnerUpdateEvent => {
  // 1. Type of event
  const type = 'account-owner-update';

  // 2. Parse particular args
  const accountId = (event.args?.accountId as BigNumber).toString();
  const newOwner = event.args?.newOwner as string;

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    accountId,
    newOwner: convertLowercaseString(newOwner),
  };
};
