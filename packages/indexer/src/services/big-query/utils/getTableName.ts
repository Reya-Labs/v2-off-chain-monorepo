import { getEnvironment } from '../../../utils/env-vars';
import { DATASET_ID, PROJECT_ID } from '../constants';
import { TableType } from '../types';

// Returns the name of BigQuery tables
export const getTableName = (tableType: TableType): string => {
  const tag = getEnvironment();

  switch (tableType) {
    case 'collateral_updates': {
      return `[${tag}] Collateral Updates`;
    }

    default: {
      throw new Error(`Unrecognized table.`);
    }
  }
};

// Returns the full ID of BigQuery tables
export const getTableFullName = (tableType: TableType): string => {
  return `${PROJECT_ID}.${DATASET_ID}.${getTableName(tableType)}`;
};
