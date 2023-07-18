import { AccountEntryUpdate } from '../specific';
import { UpdateBatch, TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';

export const updateAccountEntry = (
  environmentV2Tag: string,
  chainId: number,
  accountId: string,
  { owner }: AccountEntryUpdate,
): UpdateBatch => {
  const tableName = getTableFullName(environmentV2Tag, TableType.accounts);

  const updates: string[] = [];
  if (owner !== undefined) {
    updates.push(`owner="${owner}"`);
  }

  if (updates.length === 0) {
    return [];
  }

  const sqlTransactionQuery = `UPDATE \`${tableName}\` SET ${updates.join(
    ',',
  )} WHERE chainId=${chainId} AND accountId="${accountId}";
  `;

  return [sqlTransactionQuery];
};
