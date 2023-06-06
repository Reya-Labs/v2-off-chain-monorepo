import { PROJECT_ID } from '../constants';
import { TableType } from '../types';
import { getProtocolV2DatasetName } from './datasets';

// Returns the name of BigQuery tables
export const getTableName = (tableType: TableType): string => {
  switch (tableType) {
    case TableType.raw_collateral_updates: {
      return `Raw Collateral Updates`;
    }

    case TableType.raw_market_configured: {
      return `Raw Market Configured`;
    }

    case TableType.raw_market_fee_configured: {
      return `Raw Market Fee Configured`;
    }

    case TableType.raw_rate_oracle_configured: {
      return `Raw Rate Oracle Configured`;
    }

    case TableType.raw_product_position_updated: {
      return `Raw Product Position Updated`;
    }

    case TableType.raw_vamm_created: {
      return `Raw Vamm Created`;
    }

    case TableType.raw_vamm_price_change: {
      return `Raw Vamm Price Change`;
    }

    case TableType.markets: {
      return `Markets`;
    }

    case TableType.liquidity_indices: {
      return `Liquidity Indices`;
    }

    case TableType.positions: {
      return `Positions`;
    }
  }
};

// Returns the full ID of BigQuery tables
export const getTableFullName = (tableType: TableType): string => {
  const datasetName = getProtocolV2DatasetName();
  return `${PROJECT_ID}.${datasetName}.${getTableName(tableType)}`;
};
