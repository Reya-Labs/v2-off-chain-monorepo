/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { getBigQuery } from '../../../global';
import { mapToBigQueryVoyage } from '../../mappers';
import { BigQueryVoyage } from '../../types';

export const getVoyages = async (): Promise<BigQueryVoyage[]> => {
  const bigQuery = getBigQuery();

  const getVoyagesQuery = `
    SELECT id, startTimestamp, endTimestamp
    FROM \`risk-monitoring-361911.voyage.voyages\`
    ORDER BY startTimestamp ASC 
  `;

  const [rows] = await bigQuery.query({
    query: getVoyagesQuery,
  });

  if (!rows) {
    return [];
  }

  return rows.map(mapToBigQueryVoyage);
};
