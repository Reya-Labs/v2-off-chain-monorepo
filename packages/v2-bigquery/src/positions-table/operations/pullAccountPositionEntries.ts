import { getBigQuery } from '../../client';
import { mapRow, PositionEntry } from '../specific';
import { tableName } from '../specific';

export const pullAccountPositionEntries = async (
  chainId: number,
  accountId: string,
): Promise<PositionEntry[]> => {
  const bigQuery = getBigQuery();

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE chainId=${chainId} AND accountId="${accountId}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map(mapRow);
};
