import { Table, TableMetadata } from '@google-cloud/bigquery';

import { getTable } from './getTable';
import { getBigQuery } from '../client';
import { getTableName } from './getTableName';
import { tableSchemas } from './tableSchemas';
import { TableType } from '../types';
import { getProtocolV2DatasetName } from '../dataset-infra/getProtocolV2DatasetName';

export const createTable = async (
  environmentV2Tag: string,
  tableType: TableType,
): Promise<void> => {
  const bigQuery = getBigQuery();
  const tableName = getTableName(tableType);
  const schema = tableSchemas[tableType];

  const existingTable: Table | null = await getTable(
    environmentV2Tag,
    tableName,
  );

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
  const datasetName = getProtocolV2DatasetName(environmentV2Tag);
  const [table] = await bigQuery
    .dataset(datasetName)
    .createTable(tableName, options);

  console.log(`Table ${table.id || ''} created.`);
};
