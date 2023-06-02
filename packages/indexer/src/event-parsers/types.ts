import { Address } from '../utils/types';

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

// Core

// state-capturing event
export type AccountCreatedEvent = BaseEvent & {
  accountId: string; // big number
  owner: Address;
};

// state-capturing event
export type AccountOwnerUpdateEvent = BaseEvent & {
  accountId: string; // big number
  newOwner: Address;
};

// state-capturing event
export type CollateralConfiguredEvent = BaseEvent & {
  depositingEnabled: boolean;
  liquidationBooster: number;
  tokenAddress: Address;
  cap: string; // big number (Cap might be set to max uint256 and does not fit to number)
};

export type CollateralUpdateEvent = BaseEvent & {
  accountId: string; // big number
  collateralType: Address;
  collateralAmount: number;
  liquidatorBoosterAmount: number;
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
export type MarketFeeConfiguredEvent = BaseEvent & {
  productId: string; // big number
  marketId: string; // big number
  feeCollectorAccountId: string; // big number
  atomicMakerFee: number;
  atomicTakerFee: number;
};

// state-capturing event
export type ProductRegisteredEvent = BaseEvent & {
  product: Address;
  productId: string; // big number
  name: string;
  sender: Address;
};

// Product

// state-capturing event
export type MarketConfiguredEvent = BaseEvent & {
  marketId: string; // big number
  quoteToken: Address;
};

// state-capturing event
export type RateOracleConfiguredEvent = BaseEvent & {
  marketId: string; // big number
  oracleAddress: Address;
};

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

export type VammCreatedEvent = BaseEvent & {
  marketId: string; // big number

  // mutable
  priceImpactPhi: number; // big number
  priceImpactBeta: number; // big number
  spread: number; // big number
  rateOracle: Address;

  // immutable
  maxLiquidityPerTick: string; // big number
  tickSpacing: number;
  maturityTimestamp: number;
};

export type VammPriceChangeEvent = BaseEvent & {
  marketId: string; // big number
  maturityTimestamp: number;
  tick: number;
};

export type ProtocolEvent =
  | AccountCreatedEvent
  | AccountOwnerUpdateEvent
  | CollateralConfiguredEvent
  | CollateralUpdateEvent
  | LiquidationEvent
  | MarketFeeConfiguredEvent
  | ProductRegisteredEvent
  | MarketConfiguredEvent
  | RateOracleConfiguredEvent
  | TakerOrderEvent
  | MakerOrderEvent
  | VammCreatedEvent
  | VammPriceChangeEvent;
