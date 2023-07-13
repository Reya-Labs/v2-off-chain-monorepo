import { getBigQuery } from '../client';
import { getProtocolV2DatasetName } from './getProtocolV2DatasetName';

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
