import { getBigQuery } from '../../client';
import { getTableFullName } from '../../utils/getTableName';
import { TableType } from '../../types';
import { PositionEntry } from '../types';
import { mapToPositionEntry } from '../mapper';
import { PositionIdData, encodePositionId } from '../positionId';

export const pullPositionEntry = async (
  idData: PositionIdData,
): Promise<PositionEntry | null> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(TableType.positions);

  const id = encodePositionId(idData);
  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE id="${id}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapToPositionEntry(rows[0]);
};
