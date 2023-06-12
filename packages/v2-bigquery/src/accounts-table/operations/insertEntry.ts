import { getBigQuery } from '../../client';
import { AccountEntry, tableName } from '../specific';

export const insertAccountEntry = async (
  entry: AccountEntry,
): Promise<void> => {
  const bigQuery = getBigQuery();

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
