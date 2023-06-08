import { Address } from '../../utils/convertLowercase';

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
