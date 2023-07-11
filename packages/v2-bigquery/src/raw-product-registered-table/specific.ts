import { Address } from '@voltz-protocol/commons-v2';
import { BaseEvent } from '../common-table-support';

// action-tracking event
export type ProductRegisteredEvent = BaseEvent & {
  product: Address;
  productId: string; // big number
  name: string;
  sender: Address;
};
