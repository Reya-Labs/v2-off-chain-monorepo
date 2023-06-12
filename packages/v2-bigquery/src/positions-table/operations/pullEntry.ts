import { getBigQuery } from '../../client';
import { mapRow, PositionEntry } from '../specific';
import { PositionIdData, encodePositionId } from '../positionId';
import { tableName } from '../specific';

export const pullPositionEntry = async (
  idData: PositionIdData,
): Promise<PositionEntry | null> => {
  const bigQuery = getBigQuery();

  const id = encodePositionId(idData);
  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE id="${id}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapRow(rows[0]);
};
