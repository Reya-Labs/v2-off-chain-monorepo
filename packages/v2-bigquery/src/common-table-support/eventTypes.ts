// todo: add tables for these events and move them to their particular folder

import { Address } from '@voltz-protocol/commons-v2';
import { BaseEvent } from './baseEvent';

// state-capturing event
export type CollateralConfiguredEvent = BaseEvent & {
  depositingEnabled: boolean;
  liquidationBooster: number;
  tokenAddress: Address;
  cap: string; // big number (Cap might be set to max uint256 and does not fit to number)
};

// action-tracking event
export type LiquidationEvent = BaseEvent & {
  liquidatedAccountId: string; // big number
  collateralType: Address;
  sender: Address;
  liquidatorAccountId: string; // big number
  liquidatorRewardAmount: number;
  imPreClose: number;
  imPostClose: number;
};

// action-tracking event
export type ProductRegisteredEvent = BaseEvent & {
  product: Address;
  productId: string; // big number
  name: string;
  sender: Address;
};

// action-tracking event
export type TakerOrderEvent = BaseEvent & {
  accountId: string; // big number

  marketId: string; // big number
  maturityTimestamp: number;
  quoteToken: Address;

  executedBaseAmount: number;
  executedQuoteAmount: number;

  annualizedBaseAmount: number;
};

// action-tracking event
export type MakerOrderEvent = BaseEvent & {
  accountId: string; // big number

  marketId: string; // big number
  maturityTimestamp: number;
  quoteToken: Address;

  tickLower: number;
  tickUpper: number;
  executedBaseAmount: number;
};
