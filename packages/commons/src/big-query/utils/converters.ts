import {
  BigQuery,
  BigQueryInt,
  BigQueryTimestamp,
} from '@google-cloud/bigquery';

// Converts BigQuery number to JS number
export const bqNumericToNumber = (bqNumeric: BigQueryInt): number => {
  return Number(bqNumeric.toString());
};

// Converts BigQuery timestamp to unix time in seconds
export const bqTimestampToUnixSeconds = (
  bqTimestamp: BigQueryTimestamp,
): number => {
  return Math.floor(new Date(bqTimestamp.value).getTime() / 1000);
};

// Converts unix time in seconds to BigQuery timestamp
export const secondsToBqDate = (timestamp: number): string => {
  return BigQuery.timestamp(timestamp).value;
};
