import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { UpdateBatch } from '../../types';
import { AccountEntry } from '../specific';

export const insertAccountEntry = (
  environmentV2Tag: string,
  entry: AccountEntry,
): UpdateBatch => {
  const tableName = getTableFullName(environmentV2Tag, TableType.accounts);

  const row = `
    ${entry.chainId},
    "${entry.accountId}",
    "${entry.owner}"
  `;

  const sqlTransactionQuery = `INSERT INTO \`${tableName}\` VALUES (${row});`;
  return [sqlTransactionQuery];
};
