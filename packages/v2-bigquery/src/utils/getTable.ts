import { Table } from '@google-cloud/bigquery';

import { getBigQuery } from '../client';
import { getProtocolV2DatasetName } from './getProtocolV2DatasetName';

export const getTable = async (
  environmentV2Tag: string,
  tableName: string,
): Promise<Table | null> => {
  const bigQuery = getBigQuery();

  const datasetName = getProtocolV2DatasetName(environmentV2Tag);
  const [tables] = await bigQuery.dataset(datasetName).getTables();

  const table = tables.find((t) => t.id === tableName);

  if (!table) {
    return null;
  }

  return table;
};
