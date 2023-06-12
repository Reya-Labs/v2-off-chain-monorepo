import { Table } from '@google-cloud/bigquery';

import { getBigQuery } from '../global';
import { DATASET_ID } from './utils';

export const getTable = async (tableName: string): Promise<Table | null> => {
  const bigQuery = getBigQuery();

  const [tables] = await bigQuery.dataset(DATASET_ID).getTables();

  const table: Table | undefined = tables.find((t) => {
    return t.id === tableName;
  });

  if (!table) {
    return null;
  }

  return table;
};
