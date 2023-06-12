import {
  BigQuery,
  BigQueryInt,
  BigQueryTimestamp,
} from '@google-cloud/bigquery';
import * as dotenv from 'dotenv';

dotenv.config();

type Table =
  | 'active_swaps'
  | 'mints_and_burns'
  | 'positions'
  | 'pools'
  | 'margin_updates';

// BigQuery project and dataset IDs
export const PROJECT_ID = 'risk-monitoring-361911';
export const DATASET_ID = 'voltz_v1_positions';

// Scale and precision of number in Big Query
export const PRECISION = 36;
export const SCALE = 18;

// Returns the name of BigQuery tables
export const getTableName = (table: Table): string => {
  if (!process.env.ENV) {
    throw new Error(
      'Environment has not been specified in environment variables',
    );
  }

  switch (table) {
    case 'active_swaps': {
      if (!process.env.ACTIVE_SWAPS_TABLE_ID) {
        throw new Error(
          'Active swaps table has not specified in environment variables',
        );
      }

      return `${process.env.ACTIVE_SWAPS_TABLE_ID} ${process.env.ENV}`;
    }

    case 'mints_and_burns': {
      if (!process.env.MINTS_BURNS_TABLE_ID) {
        throw new Error(
          'Mints and burns table has not specified in environment variables',
        );
      }

      return `${process.env.MINTS_BURNS_TABLE_ID} ${process.env.ENV}`;
    }

    case 'positions': {
      if (!process.env.POSITIONS_TABLE_ID) {
        throw new Error(
          'Positions table has not specified in environment variables',
        );
      }

      return `${process.env.POSITIONS_TABLE_ID} ${process.env.ENV}`;
    }

    case 'pools': {
      if (!process.env.POOLS_TABLE_ID) {
        throw new Error(
          'Pools table has not specified in environment variables',
        );
      }

      return `${process.env.POOLS_TABLE_ID} ${process.env.ENV}`;
    }

    case 'margin_updates': {
      if (!process.env.MARGIN_UPDATES_TABLE_ID) {
        throw new Error(
          'Margin updates table has not specified in environment variables',
        );
      }

      return `${process.env.MARGIN_UPDATES_TABLE_ID} ${process.env.ENV}`;
    }
  }
};

// Returns the full ID of BigQuery tables
export const getTableFullID = (table: Table): string => {
  return `${PROJECT_ID}.${DATASET_ID}.${getTableName(table)}`;
};

// Converts BigQuery number to JS number
export const bqNumericToNumber = (bqNumeric: BigQueryInt): number => {
  return Number(bqNumeric.toString());
};

// Converts BigQuery timestamp to unix time in seconds
export const bqTimestampToUnixSeconds = (
  bqTimestamp: BigQueryTimestamp,
): number => {
  return Math.floor(new Date(bqTimestamp.value).getTime() / 1000);
};

// Converts unix time in seconds to BigQuery timestamp
export const secondsToBqDate = (timestamp: number): string => {
  return BigQuery.timestamp(timestamp).value;
};
