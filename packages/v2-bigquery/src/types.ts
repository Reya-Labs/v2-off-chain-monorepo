export enum TableType {
  raw_account_created = 'raw_account_created',
  raw_account_owner_updates = 'raw_account_owner_updates',
  raw_collateral_updates = 'raw_collateral_updates',
  raw_market_configured = 'raw_market_configured',
  raw_market_fee_configured = 'raw_market_fee_configured',
  raw_rate_oracle_configured = 'raw_rate_oracle_configured',
  raw_product_position_updated = 'raw_product_position_updated',
  raw_vamm_created = 'raw_vamm_created',
  raw_vamm_price_change = 'raw_vamm_price_change',
  raw_liquidity_change = 'raw_liquidity_change',
  liquidity_indices = 'liquidity_indices',
  markets = 'markets',
  positions = 'positions',
  accounts = 'accounts',
}

export type UpdateBatch = string[];
