import { Table, TableMetadata } from '@google-cloud/bigquery';

import { getTable } from '../utils/getTable';
import { getBigQuery } from '../client';
import { getTableName } from '../utils/getTableName';
import { getTableSchema } from './schemas/schemas';
import { TableType } from '../types';
import { getProtocolV2DatasetName } from '../utils/datasets';

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
  const datasetName = getProtocolV2DatasetName();
  const [table] = await bigQuery
    .dataset(datasetName)
    .createTable(tableName, options);

  console.log(`Table ${table.id || ''} created.`);
};
