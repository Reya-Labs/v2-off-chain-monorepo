import { getBigQuery } from '../../client';
import { mapToMarketEntry, MarketEntry, tableName } from '../specific';

export const pullMarketEntry = async (
  chainId: number,
  marketId: string,
): Promise<MarketEntry | null> => {
  const bigQuery = getBigQuery();

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE chainId=${chainId} AND marketId="${marketId}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapToMarketEntry(rows[0]);
};
