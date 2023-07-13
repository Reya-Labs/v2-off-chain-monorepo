import { PROJECT_ID } from '../constants';
import { getProtocolV2DatasetName } from '../dataset-infra/getProtocolV2DatasetName';
import { TableType } from '../types';

const tableNames: Record<TableType, string> = {
  [TableType.raw_account_created]: `Raw Account Created`,
  [TableType.raw_account_owner_updates]: `Raw Account Owner Updates`,
  [TableType.raw_collateral_configured]: `Raw Collateral Configured`,
  [TableType.raw_collateral_updates]: `Raw Collateral Updates`,
  [TableType.raw_deposited_withdrawn]: `Raw Deposited Withdrawn`,
  [TableType.raw_liquidation]: `Raw Liquidations`,
  [TableType.raw_market_fee_configured]: `Raw Market Fee Configured`,
  [TableType.raw_product_registered]: `Raw Product Registered`,

  [TableType.raw_dated_irs_position_settled]: `Raw Dated Irs Position Settlements`,
  [TableType.raw_market_configured]: `Raw Market Configured`,
  [TableType.raw_product_position_updated]: `Raw Product Position Updated`,
  [TableType.raw_rate_oracle_configured]: `Raw Rate Oracle Configured`,
  [TableType.raw_taker_order]: `Raw Taker Orders`,

  [TableType.raw_liquidity_change]: `Raw Liquidity Change`,
  [TableType.raw_vamm_created]: `Raw Vamm Created`,
  [TableType.raw_vamm_price_change]: `Raw Vamm Price Change`,

  [TableType.accounts]: `Accounts`,
  [TableType.liquidity_indices]: `Liquidity Indices`,
  [TableType.markets]: `Markets`,
  [TableType.positions]: `Positions`,
};

// Returns the name of BigQuery tables
export const getTableName = (tableType: TableType): string => {
  return tableNames[tableType];
};

// Returns the full ID of BigQuery tables
export const getTableFullName = (
  environmentV2Tag: string,
  tableType: TableType,
): string => {
  const datasetName = getProtocolV2DatasetName(environmentV2Tag);
  return `${PROJECT_ID}.${datasetName}.${getTableName(tableType)}`;
};
