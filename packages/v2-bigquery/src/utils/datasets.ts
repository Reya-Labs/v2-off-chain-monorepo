import { getEnvironment } from '@voltz-protocol/commons-v2';
import { getBigQuery } from '../client';

export const getProtocolV2DatasetName = (): string => {
  const tag = getEnvironment();
  return `${tag}_protocol_dated_irs_v2`;
};

export const createProtocolV2Dataset = async () => {
  const bigQuery = getBigQuery();
  const datasetName = getProtocolV2DatasetName();

  const [datasets] = await bigQuery.getDatasets();
  const dataset = datasets.find((d) => d.id === datasetName);

  if (dataset) {
    console.log(`Dataset ${datasetName} already exists.`);
    return;
  }

  await bigQuery.createDataset(datasetName);
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
