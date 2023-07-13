import { TableField } from '@google-cloud/bigquery';
import { TableType } from '../types';
import { accountsTableSchema } from '../tables/accounts-table/schema';
import { liquidityIndicesTableSchema } from '../tables/liquidity-indices-table/schema';
import { marketsTableSchema } from '../tables/markets-table/schema';
import { positionsTableSchema } from '../tables/positions-table/schema';
import { rawAccountCreatedTableSchema } from '../tables/raw-account-created-table/schema';
import { rawAccountOwnerUpdatesTableSchema } from '../tables/raw-account-owner-updates-table/schema';
import { rawCollateralConfiguredTableSchema } from '../tables/raw-collateral-configured-table/schema';
import { rawCollateralUpdateTableSchema } from '../tables/raw-collateral-updates-table/schema';
import { rawDatedIrsSettlementsTableSchema } from '../tables/raw-dated-irs-settlements-table/schema';
import { rawDepositedWithdrawnTableSchema } from '../tables/raw-deposited-withdrawn-table/schema';
import { rawLiquidationsTableSchema } from '../tables/raw-liquidations-table/schema';
import { rawLiquidityChangeTableSchema } from '../tables/raw-liquidity-changes-table/schema';
import { rawMarketConfiguredTableSchema } from '../tables/raw-market-configured-table/schema';
import { rawMarketFeeConfiguredTableSchema } from '../tables/raw-market-fee-configured-table/schema';
import { rawProductPositionUpdatedTableSchema } from '../tables/raw-product-position-updated-table/schema';
import { rawProductRegisteredTableSchema } from '../tables/raw-product-registered-table/schema';
import { rawRateOracleConfiguredTableSchema } from '../tables/raw-rate-oracle-configured-table/schema';
import { rawTakerOrderTableSchema } from '../tables/raw-taker-orders-table/schema';
import { rawVammCreatedTableSchema } from '../tables/raw-vamm-created-table/schema';
import { rawVammPriceChangeTableSchema } from '../tables/raw-vamm-price-change-table/schema';

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
