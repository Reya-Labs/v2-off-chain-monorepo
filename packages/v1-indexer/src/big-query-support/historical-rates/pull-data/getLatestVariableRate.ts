/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  SECONDS_IN_DAY,
  getTimestampInSeconds,
} from '@voltz-protocol/commons-v2';
import { getBigQuery } from '../../../global';
import { mapToBigQueryHistoricalRateRow } from '../../mappers';
import { find24HourDatapoint } from './utils/find24HourDatapoint';

export type GetLatestVariableRateResponse = {
  latestRate: number;
  rateChange24h: number;
};

/**
 Get maximum event block number per vamm
 */
export const getLatestVariableRate = async (
  chainId: number,
  rateOracleAddress: string,
): Promise<GetLatestVariableRateResponse> => {
  const bigQuery = getBigQuery();

  const currentTime = getTimestampInSeconds();
  const lookbackWindow = 2 * SECONDS_IN_DAY;

  const variableRatesQuery = `
    SELECT DISTINCT variable_rate as rate, timestamp FROM \`risk-monitoring-361911.historical_rates.variable_rates\`
      WHERE rate_oracle_address = "${rateOracleAddress}"
      AND chain_id = ${chainId}
      AND timestamp >= ${currentTime - lookbackWindow}
  `;

  const options = {
    query: variableRatesQuery,
  };

  const [rows] = await bigQuery.query(options);

  if (!rows || rows.length === 0) {
    return {
      latestRate: 0,
      rateChange24h: 0,
    };
  }

  const datapoints = rows
    .map(mapToBigQueryHistoricalRateRow)
    .sort((a, b) => b.timestamp - a.timestamp);
  const latestDatapoint = datapoints[0];

  if (datapoints.length === 1) {
    return {
      latestRate: latestDatapoint.rate,
      rateChange24h: 0,
    };
  }

  const previousDatapoint = find24HourDatapoint(datapoints);

  if (latestDatapoint.timestamp === previousDatapoint.timestamp) {
    return {
      latestRate: latestDatapoint.rate,
      rateChange24h: 0,
    };
  }

  const deltaRate = latestDatapoint.rate - previousDatapoint.rate;
  const deltaTimestamp =
    latestDatapoint.timestamp - previousDatapoint.timestamp;
  const rateChange24h = (deltaRate / deltaTimestamp) * SECONDS_IN_DAY;

  return {
    latestRate: latestDatapoint.rate,
    rateChange24h,
  };
};
