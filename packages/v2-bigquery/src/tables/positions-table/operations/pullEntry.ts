import { getBigQuery } from '../../../client';
import { mapRow, PositionEntry } from '../specific';
import { TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';

export const pullPositionEntry = async (
  environmentV2Tag: string,
  id: string,
): Promise<PositionEntry | null> => {
  const bigQuery = getBigQuery();

  const tableName = getTableFullName(environmentV2Tag, TableType.positions);

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE id="${id}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapRow(rows[0]);
};
