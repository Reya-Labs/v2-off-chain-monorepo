import { Address } from '@voltz-protocol/commons-v2';

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
