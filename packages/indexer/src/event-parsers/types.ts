export type EventType =
  | 'taker-order'
  | 'maker-order'
  | 'collateral-deposited'
  | 'collateral-withdrawn'
  | 'account-created';

export interface BaseEvent {
  id: string;
  type: EventType;

  chainId: number;
  source: Lowercase<string>;

  blockTimestamp: number;
  blockNumber: number;
  blockHash: string;

  transactionIndex: number;
  transactionHash: string;
  logIndex: number;
}

// Core

// state-capturing event
export interface AccountCreatedEvent extends BaseEvent {
  accountId: string; // big number
  owner: Lowercase<string>;
}

// state-capturing event
export interface AccountOwnerUpdateEvent extends BaseEvent {
  accountId: string; // big number
  newOwner: Lowercase<string>;
}

// state-capturing event
export interface CollateralConfiguredEvent extends BaseEvent {
  depositingEnabled: boolean;
  liquidationBooster: number;
  tokenAddress: Lowercase<string>;
  cap: string; // big number
}

// action-tracking event
export interface CollateralDepositedEvent extends BaseEvent {
  accountId: string; // big number
  collateralType: Lowercase<string>;
  tokenAmount: number;
}

// action-tracking event
export interface CollateralWithdrawnEvent extends BaseEvent {
  accountId: string; // big number
  collateralType: Lowercase<string>;
  tokenAmount: number;
}

// Product

export interface TakerOrderEvent extends BaseEvent {
  accountId: string; // big number

  marketId: string; // big number
  maturityTimestamp: number;
  quoteToken: Lowercase<string>;

  executedBaseAmount: number;
  executedQuoteAmount: number;

  annualizedBaseAmount: number;
}

export interface MakerOrderEvent extends BaseEvent {
  accountId: string; // big number

  marketId: string; // big number
  maturityTimestamp: number;
  quoteToken: Lowercase<string>;

  tickLower: number;
  tickUpper: number;
  executedBaseAmount: number;
}
