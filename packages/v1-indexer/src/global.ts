import { BigQuery } from '@google-cloud/bigquery';
import { Redis } from 'ioredis';

import { PROJECT_ID } from './big-query-support/utils';
import { getRedisHost, getRedisPort } from '@voltz-protocol/commons-v2';

let bigQuery: BigQuery | null = null;
let redisClient: Redis | null = null;
export const indexInactiveTimeInMS = 300_000; // 5 min

export const getBigQuery = (): BigQuery => {
  if (bigQuery) {
    return bigQuery;
  }

  bigQuery = new BigQuery({
    projectId: PROJECT_ID,
  });

  return bigQuery;
};

export const getRedisClient = (): Redis => {
  if (redisClient) {
    return redisClient;
  }

  redisClient = new Redis(getRedisPort(), getRedisHost());
  return redisClient;
};
