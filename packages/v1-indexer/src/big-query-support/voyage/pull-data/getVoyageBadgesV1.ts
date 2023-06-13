/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { getBigQuery } from '../../../global';
import { mapToBigQueryVoyageId } from '../../mappers';

export const getWalletVoyages = async (
  chainId: number,
  walletAddress: string,
): Promise<number[]> => {
  const bigQuery = getBigQuery();

  const getWalletVoyagesQuery = `
    SELECT DISTINCT voyageId
    FROM \`risk-monitoring-361911.voyage.holders\`
    WHERE chainId = ${chainId} AND walletAddress = "${walletAddress}"
  `;

  const [rows] = await bigQuery.query({
    query: getWalletVoyagesQuery,
  });

  if (!rows) {
    return [];
  }

  return rows.map(mapToBigQueryVoyageId);
};
