import { getBigQuery } from '../../client';
import { getTableFullName } from '../../utils/getTableName';
import { TableType } from '../../types';
import { PositionEntry } from '../types';
import { mapToPositionEntry } from '../mapper';

export const pullAccountPositionEntries = async (
  chainId: number,
  accountId: string,
): Promise<PositionEntry[]> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(TableType.positions);

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE chainId=${chainId} AND accountId="${accountId}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map(mapToPositionEntry);
};
