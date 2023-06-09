import { Event } from 'ethers';

import { parseBaseEvent } from './utils/parseBaseEvent';
import {
  convertLowercaseString,
  ProductRegisteredEvent,
} from '@voltz-protocol/commons-v2';

export const parseProductRegistered = (
  chainId: number,
  event: Event,
): ProductRegisteredEvent => {
  // 1. Type of event
  const type = 'product-registered';

  // 2. Parse particular args
  const product = event.args?.product as string;
  const productId = event.args?.productId as string;
  const name = event.args?.name as string;
  const sender = event.args?.sender as string;

  // 3. Parse base event
  const baseEvent = parseBaseEvent(chainId, event, type);

  // 4. Return particular event
  return {
    ...baseEvent,

    product: convertLowercaseString(product),
    productId,
    name,
    sender: convertLowercaseString(sender),
  };
};
