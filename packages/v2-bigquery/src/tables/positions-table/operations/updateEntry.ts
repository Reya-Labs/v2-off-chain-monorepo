import { isUndefined } from '@voltz-protocol/commons-v2';
import { PositionEntryUpdate } from '../specific';
import { TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';
import { UpdateBatch } from '../../../types';

export const updatePositionEntry = (
  environmentV2Tag: string,
  id: string,
  update: PositionEntryUpdate,
): UpdateBatch => {
  const tableName = getTableFullName(environmentV2Tag, TableType.positions);

  const updates: string[] = [];
  if (!isUndefined(update.base)) {
    updates.push(`base=${update.base}`);
  }

  if (!isUndefined(update.timeDependentQuote)) {
    updates.push(`timeDependentQuote=${update.timeDependentQuote}`);
  }

  if (!isUndefined(update.freeQuote)) {
    updates.push(`freeQuote=${update.freeQuote}`);
  }

  if (!isUndefined(update.lockedFixedRate)) {
    updates.push(`lockedFixedRate=${update.lockedFixedRate}`);
  }

  if (!isUndefined(update.liquidity)) {
    updates.push(`liquidity=${update.liquidity}`);
  }

  if (!isUndefined(update.paidFees)) {
    updates.push(`paidFees=${update.paidFees}`);
  }

  if (updates.length === 0) {
    return [];
  }

  const sqlTransactionQuery = `
    UPDATE \`${tableName}\`
      SET ${updates.join(',')}
      WHERE id="${id}";
  `;

  return [sqlTransactionQuery];
};
