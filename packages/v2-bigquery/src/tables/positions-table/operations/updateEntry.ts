import { PositionEntryUpdate } from '../specific';
import { TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';
import { UpdateBatch } from '../../../types';

export const updatePositionEntry = (
  environmentV2Tag: string,
  id: string,
  {
    base,
    timeDependentQuote,
    freeQuote,
    lockedFixedRate,
    liquidity,
    paidFees,
  }: PositionEntryUpdate,
): UpdateBatch => {
  const tableName = getTableFullName(environmentV2Tag, TableType.positions);

  const updates: string[] = [];
  if (base !== undefined) {
    updates.push(`base=${base}`);
  }

  if (timeDependentQuote !== undefined) {
    updates.push(`timeDependentQuote=${timeDependentQuote}`);
  }

  if (freeQuote !== undefined) {
    updates.push(`freeQuote=${freeQuote}`);
  }

  if (lockedFixedRate !== undefined) {
    updates.push(`lockedFixedRate=${lockedFixedRate}`);
  }

  if (liquidity !== undefined) {
    updates.push(`liquidity=${liquidity}`);
  }

  if (paidFees !== undefined) {
    updates.push(`paidFees=${paidFees}`);
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
