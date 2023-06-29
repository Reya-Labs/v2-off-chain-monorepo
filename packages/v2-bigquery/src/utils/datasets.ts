import { fetchMultiplePromises } from '@voltz-protocol/commons-v2';
import { getBigQuery } from '../client';
import { createTable } from '../create-tables/createTable';
import { TableType } from '../types';
import { getProtocolV2DatasetName } from './getProtocolV2DatasetName';

// Creates dataset and all tables
export const createProtocolV2Dataset = async (environmentV2Tag: string) => {
  const bigQuery = getBigQuery();
  const datasetName = getProtocolV2DatasetName(environmentV2Tag);

  const [datasets] = await bigQuery.getDatasets();
  const dataset = datasets.find((d) => d.id === datasetName);

  if (!dataset) {
    await bigQuery.createDataset(datasetName);
  }

  // Create tables
  await fetchMultiplePromises(
    Object.keys(TableType).map((tableType) =>
      createTable(environmentV2Tag, tableType as TableType),
    ),
    true,
  );
};

export const deleteProtocolV2Dataset = async (environmentV2Tag: string) => {
  const bigQuery = getBigQuery();
  const datasetName = getProtocolV2DatasetName(environmentV2Tag);

  const [datasets] = await bigQuery.getDatasets();
  const dataset = datasets.find((d) => d.id === datasetName);

  if (!dataset) {
    console.log(`Dataset ${datasetName} does not exist.`);
    return;
  }

  await bigQuery.dataset(datasetName).delete();
};
