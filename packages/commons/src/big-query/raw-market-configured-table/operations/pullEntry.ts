import { getBigQuery } from '../../client';
import { MarketConfiguredEvent, mapRow, tableName } from '../specific';

export const pullMarketConfiguredEvent = async (
  id: string,
): Promise<MarketConfiguredEvent | null> => {
  const bigQuery = getBigQuery();

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE id="${id}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapRow(rows[0]);
};
