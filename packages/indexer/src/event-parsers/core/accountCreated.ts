import { Event, BigNumber } from 'ethers';

import { parseBaseEvent } from '../utils/baseEvent';
import {
  convertLowercaseString,
  ProtocolEventType,
  AccountCreatedEvent,
} from '@voltz-protocol/commons-v2';

export const parseAccountCreated = (
  chainId: number,
  event: Event,
): AccountCreatedEvent => {
  // 1. Type of event
  const type: ProtocolEventType = 'account-created';

  // 2. Parse particular args
  const accountId = (event.args?.accountId as BigNumber).toString();
  const owner = event.args?.owner as string;

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    accountId,
    owner: convertLowercaseString(owner),
  };
};
