import { Event, BigNumber } from 'ethers';

import {
  convertLowercaseString,
  AccountOwnerUpdateEvent,
  ProtocolEventType,
} from '@voltz-protocol/commons-v2';
import { parseBaseEvent } from './utils/parseBaseEvent';

export const parseAccountOwnerUpdate = (
  chainId: number,
  event: Event,
): AccountOwnerUpdateEvent => {
  // 1. Type of event
  const type = ProtocolEventType.account_owner_update;

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
