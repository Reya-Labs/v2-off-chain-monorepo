import {
  BigQuery,
  BigQueryInt,
  BigQueryTimestamp,
} from '@google-cloud/bigquery';
import { getTimestampInSeconds } from '@voltz-protocol/commons-v2';

// Converts BigQuery number to JS number
export const bqNumericToNumber = (bqNumeric: BigQueryInt): number => {
  return Number(bqNumeric.toString());
};

// Converts BigQuery timestamp to unix time in seconds
export const bqTimestampToUnixSeconds = (
  bqTimestamp: BigQueryTimestamp,
): number => {
  return getTimestampInSeconds(new Date(bqTimestamp.value).getTime());
};

// Converts unix time in seconds to BigQuery timestamp
export const secondsToBqDate = (timestamp: number): string => {
  return BigQuery.timestamp(timestamp).value;
};
