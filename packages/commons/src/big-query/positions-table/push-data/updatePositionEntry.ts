import { isUndefined } from '../../../utils/isUndefined';
import { getBigQuery } from '../../client';
import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { PositionIdData, encodePositionId } from '../positionId';
import { PositionEntryUpdate } from '../types';

export const updatePositionEntry = async (
  idData: PositionIdData,
  update: PositionEntryUpdate,
): Promise<void> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(TableType.positions);

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
