import { Address } from '../../utils/convertLowercase';

export enum ProtocolEventType {
  account_created = 'account_created', // core
  account_owner_update = 'account_owner_update', // core
  collateral_configured = 'collateral_configured', // core
  collateral_update = 'collateral_update', // core
  liquidation = 'liquidation', // core
  market_fee_configured = 'market_fee_configured', // core
  product_registered = 'product_registered', // core
  market_configured = 'market_configured', // product
  rate_oracle_configured = 'rate_oracle_configured', // product
  product_position_updated = 'product_position_updated', // product
  liquidity_change = 'liquidity_change', // exchange
  maker_order = 'maker_order', // exchange
  taker_order = 'taker_order', // exchange
  vamm_created = 'vamm_created', // exchange
  vamm_price_change = 'vamm_price_change', // exchange
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
