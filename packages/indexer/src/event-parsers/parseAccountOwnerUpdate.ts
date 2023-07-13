import { Event, BigNumber } from 'ethers';

import {
  AccountOwnerUpdateEvent,
  ProtocolEventType,
} from '@voltz-protocol/bigquery-v2';
import { parseBaseEvent } from './utils/parseBaseEvent';
import { convertToAddress } from '@voltz-protocol/commons-v2';

export const parseAccountOwnerUpdate = (
  chainId: number,
  event: Event,
): AccountOwnerUpdateEvent => {
  // 1. Type of event
  const type = ProtocolEventType.AccountOwnerUpdate;

  // 2. Parse particular args
  const accountId = (event.args?.accountId as BigNumber).toString();
  const newOwner = event.args?.newOwner as string;

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    accountId,
    newOwner: convertToAddress(newOwner),
  };
};
