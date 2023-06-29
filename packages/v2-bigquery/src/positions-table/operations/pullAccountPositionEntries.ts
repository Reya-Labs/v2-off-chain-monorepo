import { getBigQuery } from '../../client';
import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { mapRow, PositionEntry } from '../specific';

export const pullAccountPositionEntries = async (
  environmentV2Tag: string,
  chainId: number,
  accountId: string,
): Promise<PositionEntry[]> => {
  const bigQuery = getBigQuery();

  const tableName = getTableFullName(environmentV2Tag, TableType.positions);

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE chainId=${chainId} AND accountId="${accountId}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map(mapRow);
};
