/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { getBigQuery } from '../../../global';
import { mapToBigQueryHistoricalRateRow } from '../../mappers';
import { BigQueryHistoricalRateRow } from '../../types';

/**
 Get maximum event block number per vamm
 */
export const getVariableRates = async (
  chainId: number,
  rateOracleAddress: string,
  startTimestamp: number,
  endTimestamp: number,
): Promise<BigQueryHistoricalRateRow[] | null> => {
  const bigQuery = getBigQuery();

  const variableRatesQuery = `
    SELECT variable_rate as rate, timestamp FROM \`risk-monitoring-361911.historical_rates.variable_rates\`
      WHERE rate_oracle_address = "${rateOracleAddress}"
      AND timestamp >= ${startTimestamp} AND timestamp <= ${endTimestamp}
      AND chain_id = ${chainId}
  `;

  const options = {
    query: variableRatesQuery,
  };

  const [rows] = await bigQuery.query(options);

  if (!rows) {
    return null;
  }

  return rows.map(mapToBigQueryHistoricalRateRow);
};
