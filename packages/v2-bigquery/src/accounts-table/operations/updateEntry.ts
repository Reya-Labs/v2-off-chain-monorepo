import { isUndefined } from '@voltz-protocol/commons-v2';
import { AccountEntryUpdate } from '../specific';
import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { UpdateBatch } from '../../types';

export const updateAccountEntry = (
  environmentV2Tag: string,
  chainId: number,
  accountId: string,
  update: AccountEntryUpdate,
): UpdateBatch => {
  const tableName = getTableFullName(environmentV2Tag, TableType.accounts);

  const updates: string[] = [];
  if (!isUndefined(update.owner)) {
    updates.push(`owner="${update.owner}"`);
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
