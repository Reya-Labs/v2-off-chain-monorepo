/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { getBigQuery } from '../../../global';
import { mapToBigQueryHistoricalRateRow } from '../../mappers';
import { BigQueryHistoricalRateRow } from '../../types';

/**
 Get maximum event block number per vamm
 */
export const getFixedRates = async (
  chainId: number,
  vammAddress: string,
  startTimestamp: number,
  endTimestamp: number,
): Promise<BigQueryHistoricalRateRow[]> => {
  const bigQuery = getBigQuery();

  const fixedRatesQuery = `
    SELECT fixed_rate as rate, timestamp FROM \`risk-monitoring-361911.historical_rates.fixed_rates\`
      WHERE vamm_address = "${vammAddress}"
      AND timestamp >= ${startTimestamp} AND timestamp <= ${endTimestamp}
      AND chain_id = ${chainId}
  `;

  const options = {
    query: fixedRatesQuery,
  };

  const [rows] = await bigQuery.query(options);

  if (!rows) {
    return [];
  }

  return rows.map(mapToBigQueryHistoricalRateRow);
};
