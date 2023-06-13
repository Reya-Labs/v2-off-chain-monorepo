import { Table } from '@google-cloud/bigquery';

import { getTable } from '../utils/getTable';
import { getBigQuery } from '../client';
import { getTableName } from '../utils/getTableName';
import { TableType } from '../types';
import { getProtocolV2DatasetName } from '../utils/datasets';

export const deleteTable = async (tableType: TableType): Promise<void> => {
  const bigQuery = getBigQuery();
  const tableName = getTableName(tableType);

  const existingTable: Table | null = await getTable(tableName);

  if (!existingTable) {
    console.log(`${tableName} does not exist`);
    return;
  }

  // Delete table in the dataset
  const datasetName = getProtocolV2DatasetName();
  await bigQuery.dataset(datasetName).table(tableName).delete();

  console.log(`Table ${existingTable.id || ''} deleted.`);
};
