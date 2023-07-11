import { TableField } from '@google-cloud/bigquery';
import { TableType } from '../types';
import { liquidityIndicesTableSchema } from '../liquidity-indices-table/schema';
import { rawCollateralUpdateTableSchema } from '../raw-collateral-updates-table/schema';
import { rawMarketConfiguredTableSchema } from '../raw-market-configured-table/schema';
import { rawMarketFeeConfiguredTableSchema } from '../raw-market-fee-configured-table/schema';
import { rawRateOracleConfiguredTableSchema } from '../raw-rate-oracle-configured-table/schema';
import { marketsTableSchema } from '../markets-table/schema';
import { rawVammCreatedTableSchema } from '../raw-vamm-created-table/schema';
import { rawVammPriceChangeTableSchema } from '../raw-vamm-price-change-table/schema';
import { rawProductPositionUpdatedTableSchema } from '../raw-product-position-updated-table/schema';
import { positionsTableSchema } from '../positions-table/schema';
import { rawLiquidityChangeTableSchema } from '../raw-liquidity-changes-table/schema';
import { accountsTableSchema } from '../accounts-table/schema';
import { rawAccountCreatedTableSchema } from '../raw-account-created-table/schema';
import { rawAccountOwnerUpdatesTableSchema } from '../raw-account-owner-updates-table/schema';
import { rawCollateralConfiguredTableSchema } from '../raw-collateral-configured-table/schema';
import { rawDepositedWithdrawnTableSchema } from '../raw-deposited-withdrawn-table/schema';
import { rawLiquidationsTableSchema } from '../raw-liquidations-table/schema';
import { rawProductRegisteredTableSchema } from '../raw-product-registered-table/schema';
import { rawDatedIrsSettlementsTableSchema } from '../raw-dated-irs-settlements-table/schema';
import { rawTakerOrderTableSchema } from '../raw-taker-orders-table/schema';

export const tableSchemas: Record<TableType, TableField[]> = {
  [TableType.raw_account_created]: rawAccountCreatedTableSchema,
  [TableType.raw_account_owner_updates]: rawAccountOwnerUpdatesTableSchema,
  [TableType.raw_collateral_configured]: rawCollateralConfiguredTableSchema,
  [TableType.raw_collateral_updates]: rawCollateralUpdateTableSchema,
  [TableType.raw_deposited_withdrawn]: rawDepositedWithdrawnTableSchema,
  [TableType.raw_liquidation]: rawLiquidationsTableSchema,
  [TableType.raw_market_fee_configured]: rawMarketFeeConfiguredTableSchema,
  [TableType.raw_product_registered]: rawProductRegisteredTableSchema,

  [TableType.raw_dated_irs_position_settled]: rawDatedIrsSettlementsTableSchema,
  [TableType.raw_market_configured]: rawMarketConfiguredTableSchema,
  [TableType.raw_product_position_updated]:
    rawProductPositionUpdatedTableSchema,
  [TableType.raw_rate_oracle_configured]: rawRateOracleConfiguredTableSchema,
  [TableType.raw_taker_order]: rawTakerOrderTableSchema,

  [TableType.raw_liquidity_change]: rawLiquidityChangeTableSchema,
  [TableType.raw_vamm_created]: rawVammCreatedTableSchema,
  [TableType.raw_vamm_price_change]: rawVammPriceChangeTableSchema,

  [TableType.accounts]: accountsTableSchema,
  [TableType.liquidity_indices]: liquidityIndicesTableSchema,
  [TableType.markets]: marketsTableSchema,
  [TableType.positions]: positionsTableSchema,
};
