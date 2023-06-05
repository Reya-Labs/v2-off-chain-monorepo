import { BigQuery } from '@google-cloud/bigquery';
import { Storage } from '@google-cloud/storage';
import { PROJECT_ID } from './constants';

let bigQuery: BigQuery | null = null;

export const getBigQuery = (): BigQuery => {
  if (bigQuery) {
    return bigQuery;
  }

  bigQuery = new BigQuery({
    projectId: PROJECT_ID,
  });

  return bigQuery;
};

export const authenticateImplicitWithAdc = async () => {
  const storage = new Storage({
    projectId: PROJECT_ID,
  });

  await storage.getBuckets();
};
