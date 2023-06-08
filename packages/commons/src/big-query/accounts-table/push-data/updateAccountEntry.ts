import { isUndefined } from '../../../utils/isUndefined';
import { getBigQuery } from '../../client';
import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { AccountEntryUpdate } from '../types';

export const updateAccountEntry = async (
  chainId: number,
  accountId: string,
  update: AccountEntryUpdate,
): Promise<void> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(TableType.accounts);

  const updates: string[] = [];
  if (!isUndefined(update.owner)) {
    updates.push(`owner=${update.owner}`);
  }

  if (updates.length === 0) {
    return;
  }

  const sqlTransactionQuery = `
    UPDATE \`${tableName}\`
      SET ${updates.join(',')}
      WHERE chainId=${chainId} AND accountId="${accountId}";
  `;

  const options = {
    query: sqlTransactionQuery,
    timeoutMs: 100000,
    useLegacySql: false,
  };

  await bigQuery.query(options);
};
