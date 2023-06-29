import { getBigQuery } from '../../client';
import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { mapRow, AccountEntry } from '../specific';

export const pullAccountEntry = async (
  environmentV2Tag: string,
  chainId: number,
  accountId: string,
): Promise<AccountEntry | null> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(environmentV2Tag, TableType.accounts);

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE chainId=${chainId} AND accountId="${accountId}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapRow(rows[0]);
};
