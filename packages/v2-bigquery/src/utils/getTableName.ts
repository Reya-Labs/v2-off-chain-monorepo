import { PROJECT_ID } from '../constants';
import { TableType } from '../types';
import { getProtocolV2DatasetName } from './getProtocolV2DatasetName';

const tableNames: Record<TableType, string> = {
  [TableType.raw_account_created]: `Raw Account Created`,
  [TableType.raw_account_owner_updates]: `Raw Account Owner Updates`,
  [TableType.raw_collateral_updates]: `Raw Collateral Updates`,
  [TableType.raw_market_configured]: `Raw Market Configured`,
  [TableType.raw_market_fee_configured]: `Raw Market Fee Configured`,
  [TableType.raw_rate_oracle_configured]: `Raw Rate Oracle Configured`,
  [TableType.raw_product_position_updated]: `Raw Product Position Updated`,
  [TableType.raw_vamm_created]: `Raw Vamm Created`,
  [TableType.raw_vamm_price_change]: `Raw Vamm Price Change`,
  [TableType.raw_liquidity_change]: `Raw Liquidity Change`,
  [TableType.markets]: `Markets`,
  [TableType.liquidity_indices]: `Liquidity Indices`,
  [TableType.positions]: `Positions`,
  [TableType.accounts]: `Accounts`,
};

// Returns the name of BigQuery tables
export const getTableName = (tableType: TableType): string => {
  return tableNames[tableType];
};

// Returns the full ID of BigQuery tables
export const getTableFullName = (tableType: TableType): string => {
  const datasetName = getProtocolV2DatasetName();
  return `${PROJECT_ID}.${datasetName}.${getTableName(tableType)}`;
};
