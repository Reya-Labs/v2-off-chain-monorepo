import { BigQuery } from '@google-cloud/bigquery';
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
