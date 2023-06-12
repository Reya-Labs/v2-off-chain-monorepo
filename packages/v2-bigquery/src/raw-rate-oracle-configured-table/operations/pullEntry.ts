import { getBigQuery } from '../../client';
import { RateOracleConfiguredEvent, tableName, mapRow } from '../specific';

export const pullRateOracleConfiguredEvent = async (
  id: string,
): Promise<RateOracleConfiguredEvent | null> => {
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
