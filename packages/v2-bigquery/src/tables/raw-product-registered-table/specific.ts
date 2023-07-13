import { Address } from '@voltz-protocol/commons-v2';
import { BaseEvent } from '../../types';

// action-tracking event
export type ProductRegisteredEvent = BaseEvent & {
  product: Address;
  productId: string; // big number
  name: string;
  sender: Address;
};
