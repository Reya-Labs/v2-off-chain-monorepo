import { getBigQuery } from '../client';
import { createTable } from '../create-tables/createTable';
import { TableType } from '../types';
import { getProtocolV2DatasetName } from './getProtocolV2DatasetName';

// Creates dataset and all tables
export const createProtocolV2Dataset = async () => {
  const bigQuery = getBigQuery();
  const datasetName = getProtocolV2DatasetName();

  const [datasets] = await bigQuery.getDatasets();
  const dataset = datasets.find((d) => d.id === datasetName);

  if (!dataset) {
    await bigQuery.createDataset(datasetName);
  }

  // Create tables
  await Promise.allSettled(
    Object.keys(TableType).map((tableType) =>
      createTable(tableType as TableType),
    ),
  );
};

export const deleteProtocolV2Dataset = async () => {
  const bigQuery = getBigQuery();
  const datasetName = getProtocolV2DatasetName();

  const [datasets] = await bigQuery.getDatasets();
  const dataset = datasets.find((d) => d.id === datasetName);

  if (!dataset) {
    console.log(`Dataset ${datasetName} does not exist.`);
    return;
  }

  await bigQuery.dataset(datasetName).delete();
};
