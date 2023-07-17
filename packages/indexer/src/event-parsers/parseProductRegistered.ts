import { BigNumber, Event } from 'ethers';

import { parseBaseEvent } from './utils/parseBaseEvent';
import {
  ProductRegisteredEvent,
  ProtocolEventType,
} from '@voltz-protocol/bigquery-v2';
import { convertToAddress } from '@voltz-protocol/commons-v2';

export const parseProductRegistered = (
  chainId: number,
  event: Event,
): ProductRegisteredEvent => {
  // 1. Type of event
  const type = ProtocolEventType.ProductRegistered;

  // 2. Parse particular args
  const product = event.args?.product as string;
  const productId = (event.args?.productId as BigNumber).toString();
  const name = event.args?.name as string;
  const sender = event.args?.sender as string;

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    product: convertToAddress(product),
    productId,
    name,
    sender: convertToAddress(sender),
  };
};
