import { Address } from '@voltz-protocol/commons-v2';
import { BaseEvent } from '../common-table-support';

// state-capturing event
export type CollateralConfiguredEvent = BaseEvent & {
  depositingEnabled: boolean;
  liquidationBooster: number;
  tokenAddress: Address;
  cap: string; // big number (Cap might be set to max uint256 and does not fit to number)
};
