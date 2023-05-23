import { Table, TableMetadata } from '@google-cloud/bigquery';

import { getTable } from '../utils/getTable';
import { getBigQuery } from '../client';
import { getTableName } from '../utils/getTableName';
import { DATASET_ID } from '../constants';
import { getTableSchema } from './schemas';
import { TableType } from '../types';

export const createTable = async (tableType: TableType): Promise<void> => {
  const bigQuery = getBigQuery();
  const tableName = getTableName(tableType);
  const schema = getTableSchema(tableType);

  const existingTable: Table | null = await getTable(tableName);

  if (existingTable) {
    console.log(`${tableName} already exists`);
    return;
  }

  // For all options, see https://cloud.google.com/bigquery/docs/reference/v2/tables#resource
  const options: TableMetadata = {
    schema,
    location: 'europe-west2',
  };

  // Create a new table in the dataset
  const [table] = await bigQuery
    .dataset(DATASET_ID)
    .createTable(tableName, options);

  console.log(`Table ${table.id || ''} created.`);
};
