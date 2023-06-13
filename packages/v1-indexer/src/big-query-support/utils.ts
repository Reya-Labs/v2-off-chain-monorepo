import {
  BigQuery,
  BigQueryInt,
  BigQueryTimestamp,
} from '@google-cloud/bigquery';
import { getEnvironment } from '@voltz-protocol/commons-v2';
import { PROJECT_ID, getBigQuery } from '../global';

export enum TableType {
  active_swaps,
  mints_and_burns,
  positions,
  pools,
  margin_updates,
}

export const getProtocolV1DatasetName = (): string => {
  const tag = getEnvironment();
  return `${tag}_indexer_v1`;
};

export const createProtocolV1Dataset = async () => {
  const bigQuery = getBigQuery();
  const datasetName = getProtocolV1DatasetName();

  const [datasets] = await bigQuery.getDatasets();
  const dataset = datasets.find((d) => d.id === datasetName);

  if (dataset) {
    console.log(`Dataset ${datasetName} already exists.`);
    return;
  }

  await bigQuery.createDataset(datasetName);
};

// Scale and precision of number in Big Query
export const PRECISION = 36;
export const SCALE = 18;

const tableNames: Record<TableType, string> = {
  [TableType.active_swaps]: 'Active Swaps',
  [TableType.mints_and_burns]: 'Mints and Burns',
  [TableType.positions]: 'Positions',
  [TableType.pools]: 'Pools',
  [TableType.margin_updates]: 'Margin Updates',
};

// Returns the name of BigQuery tables
export const getTableName = (table: TableType): string => {
  return tableNames[table];
};

// Returns the full ID of BigQuery tables
export const getTableFullID = (table: TableType): string => {
  return `${PROJECT_ID}.${getProtocolV1DatasetName()}.${getTableName(table)}`;
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
