import { PROJECT_ID } from '../constants';
import { TableType } from '../types';
import { getProtocolV2DatasetName } from './datasets';

// Returns the name of BigQuery tables
export const getTableName = (tableType: TableType): string => {
  switch (tableType) {
    case 'collateral_updates': {
      return `Collateral Updates`;
    }

    case 'liquidity_indices': {
      return `Liquidity Indices`;
    }

    default: {
      throw new Error(`Unrecognized table.`);
    }
  }
};

// Returns the full ID of BigQuery tables
export const getTableFullName = (tableType: TableType): string => {
  const datasetName = getProtocolV2DatasetName();
  return `${PROJECT_ID}.${datasetName}.${getTableName(tableType)}`;
};
