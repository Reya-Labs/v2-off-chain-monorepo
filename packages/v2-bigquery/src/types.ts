import { Address } from '@voltz-protocol/commons-v2';

export enum TableType {
  // raw core event tables
  raw_account_created = 'raw_account_created',
  raw_account_owner_updates = 'raw_account_owner_updates',
  raw_collateral_configured = 'raw_collateral_configured',
  raw_collateral_updates = 'raw_collateral_updates',
  raw_deposited_withdrawn = 'raw_deposited_withdrawn',
  raw_liquidation = 'raw_liquidation',
  raw_market_fee_configured = 'raw_market_fee_configured',
  raw_product_registered = 'raw_product_registered',

  // raw product event tables
  raw_dated_irs_position_settled = 'raw_dated_irs_position_settled',
  raw_market_configured = 'raw_market_configured',
  raw_product_position_updated = 'raw_product_position_updated',
  raw_rate_oracle_configured = 'raw_rate_oracle_configured',
  raw_taker_order = 'raw_taker_order',

  // raw instrument event tables
  raw_liquidity_change = 'raw_liquidity_change',
  raw_vamm_created = 'raw_vamm_created',
  raw_vamm_price_change = 'raw_vamm_price_change',

  // cross tables
  accounts = 'accounts',
  liquidity_indices = 'liquidity_indices',
  markets = 'markets',
  positions = 'positions',
}

export enum ProtocolEventType {
  AccountCreated = 'AccountCreated', // core
  AccountOwnerUpdate = 'AccountOwnerUpdate', // core
  CollateralConfigured = 'CollateralConfigured', // core
  CollateralUpdate = 'CollateralUpdate', // core
  DepositedWithdrawn = 'DepositedWithdrawn', // core
  Liquidation = 'Liquidation', // core
  MarketFeeConfigured = 'MarketFeeConfigured', // core
  ProductRegistered = 'ProductRegistered', // core

  DatedIRSPositionSettled = 'DatedIRSPositionSettled', // product
  MarketConfigured = 'MarketConfigured', // product
  ProductPositionUpdated = 'ProductPositionUpdated', // product
  RateOracleConfigured = 'RateOracleConfigured', // product
  TakerOrder = 'TakerOrder', // product

  LiquidityChange = 'LiquidityChange', // exchange
  VammCreated = 'VammCreated', // exchange
  VAMMPriceChange = 'VAMMPriceChange', // exchange
}

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

export type UpdateBatch = string[];
