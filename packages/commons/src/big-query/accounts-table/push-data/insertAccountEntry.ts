import { getBigQuery } from '../../client';
import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { AccountEntry } from '../types';

export const insertAccountEntry = async (
  entry: AccountEntry,
): Promise<void> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(TableType.accounts);

  const row = `
    ${entry.chainId},
    "${entry.accountId}",
    "${entry.owner}"
  `;

  // build and fire sql query
  const sqlTransactionQuery = `INSERT INTO \`${tableName}\` VALUES (${row});`;

  const options = {
    query: sqlTransactionQuery,
    timeoutMs: 100000,
    useLegacySql: false,
  };

  await bigQuery.query(options);
};
