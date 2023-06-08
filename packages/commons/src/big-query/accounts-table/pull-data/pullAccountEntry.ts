import { getBigQuery } from '../../client';
import { mapToAccountEntry } from '../mapper';
import { getTableFullName } from '../../utils/getTableName';
import { TableType } from '../../types';
import { AccountEntry } from '../types';

export const pullAccountEntry = async (
  chainId: number,
  accountId: string,
): Promise<AccountEntry | null> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(TableType.accounts);

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE chainId=${chainId} AND accountId="${accountId}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapToAccountEntry(rows[0]);
};
