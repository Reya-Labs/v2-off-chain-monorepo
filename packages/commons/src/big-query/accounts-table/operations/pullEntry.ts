import { getBigQuery } from '../../client';
import { mapRow, AccountEntry, tableName } from '../specific';

export const pullAccountEntry = async (
  chainId: number,
  accountId: string,
): Promise<AccountEntry | null> => {
  const bigQuery = getBigQuery();

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE chainId=${chainId} AND accountId="${accountId}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapRow(rows[0]);
};
