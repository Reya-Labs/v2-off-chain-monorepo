import { Address } from './convertLowercase';

export type ProtocolEventType =
  | 'account-created' // core
  | 'account-owner-update' // core
  | 'collateral-configured' // core
  | 'collateral-update' // core
  | 'liquidation' // core
  | 'market-fee-configured' // core
  | 'product-registered' // core
  | 'market-configured' // product
  | 'rate-oracle-configured' // product
  | 'product-position-updated' // product
  | 'liquidity-change' // exchange
  | 'maker-order' // exchange
  | 'taker-order' // exchange
  | 'vamm-created' // exchange
  | 'vamm-price-change'; // exchange

export type BaseEvent = {
  id: string;
  type: ProtocolEventType;

  chainId: number;
  source: Address;

  blockTimestamp: number;
  blockNumber: number;
  blockHash: string;

  transactionIndex: number;
  transactionHash: string;
  logIndex: number;
};

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

// state-capturing event
export type ProductRegisteredEvent = BaseEvent & {
  product: Address;
  productId: string; // big number
  name: string;
  sender: Address;
};

// Product

// Exchange

export type TakerOrderEvent = BaseEvent & {
  accountId: string; // big number

  marketId: string; // big number
  maturityTimestamp: number;
  quoteToken: Address;

  executedBaseAmount: number;
  executedQuoteAmount: number;

  annualizedBaseAmount: number;
};

export type MakerOrderEvent = BaseEvent & {
  accountId: string; // big number

  marketId: string; // big number
  maturityTimestamp: number;
  quoteToken: Address;

  tickLower: number;
  tickUpper: number;
  executedBaseAmount: number;
};
