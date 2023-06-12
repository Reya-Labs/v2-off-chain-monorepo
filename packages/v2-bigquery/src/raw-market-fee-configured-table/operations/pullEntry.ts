import { getBigQuery } from '../../client';
import { MarketFeeConfiguredEvent, mapRow, tableName } from '../specific';

export const pullMarketFeeConfiguredEvent = async (
  id: string,
): Promise<MarketFeeConfiguredEvent | null> => {
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
