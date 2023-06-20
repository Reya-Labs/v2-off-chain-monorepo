import { isUndefined } from '@voltz-protocol/commons-v2';
import { getBigQuery } from '../../client';
import { PositionIdData, encodePositionId } from '../positionId';
import { tableName } from '../specific';
import { PositionEntryUpdate } from '../specific';

export const updatePositionEntry = async (
  idData: PositionIdData,
  update: PositionEntryUpdate,
): Promise<void> => {
  const bigQuery = getBigQuery();

  const id = encodePositionId(idData);

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

  if (!isUndefined(update.notional)) {
    updates.push(`notional=${update.notional}`);
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
    return;
  }

  const sqlTransactionQuery = `
    UPDATE \`${tableName}\`
      SET ${updates.join(',')}
      WHERE id="${id}";
  `;

  const options = {
    query: sqlTransactionQuery,
    timeoutMs: 100000,
    useLegacySql: false,
  };

  await bigQuery.query(options);
};
