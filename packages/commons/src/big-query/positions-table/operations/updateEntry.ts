import { isUndefined } from '../../../utils/isUndefined';
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
  if (!isUndefined(update.baseBalance)) {
    updates.push(`baseBalance=${update.baseBalance}`);
  }

  if (!isUndefined(update.quoteBalance)) {
    updates.push(`quoteBalance=${update.quoteBalance}`);
  }

  if (!isUndefined(update.notionalBalance)) {
    updates.push(`notionalBalance=${update.notionalBalance}`);
  }

  if (!isUndefined(update.notionalBalance)) {
    updates.push(`liquidityBalance=${update.liquidityBalance}`);
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
