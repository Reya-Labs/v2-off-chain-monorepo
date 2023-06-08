import { getBigQuery } from '../../client';
import { VammPriceChangeEvent, mapRow, tableName } from '../specific';

export const pullVammPriceChangeEvent = async (
  id: string,
): Promise<VammPriceChangeEvent | null> => {
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