import { Table } from '@google-cloud/bigquery';

import { getBigQuery } from '../client';
import { getProtocolV2DatasetName } from './datasets';

export const getTable = async (tableName: string): Promise<Table | null> => {
  const bigQuery = getBigQuery();

  const datasetName = getProtocolV2DatasetName();
  const [tables] = await bigQuery.dataset(datasetName).getTables();

  const table = tables.find((t) => t.id === tableName);

  if (!table) {
    return null;
  }

  return table;
};
