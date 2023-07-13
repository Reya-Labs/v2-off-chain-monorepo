import { Table } from '@google-cloud/bigquery';

import { getTable } from './getTable';
import { getBigQuery } from '../client';
import { getTableName } from './getTableName';
import { TableType } from '../types';
import { getProtocolV2DatasetName } from '../dataset-infra/getProtocolV2DatasetName';

export const deleteTable = async (
  environmentV2Tag: string,
  tableType: TableType,
): Promise<void> => {
  const bigQuery = getBigQuery();
  const tableName = getTableName(tableType);

  const existingTable: Table | null = await getTable(
    environmentV2Tag,
    tableName,
  );

  if (!existingTable) {
    console.log(`${tableName} does not exist`);
    return;
  }

  // Delete table in the dataset
  const datasetName = getProtocolV2DatasetName(environmentV2Tag);
  await bigQuery.dataset(datasetName).table(tableName).delete();

  console.log(`Table ${existingTable.id || ''} deleted.`);
};
