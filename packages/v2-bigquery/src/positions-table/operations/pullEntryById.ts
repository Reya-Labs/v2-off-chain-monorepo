import { getBigQuery } from '../../client';
import { mapRow, PositionEntry } from '../specific';
import { tableName } from '../specific';

export const pullPositionEntryById = async (
  id: string,
): Promise<PositionEntry | null> => {
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
