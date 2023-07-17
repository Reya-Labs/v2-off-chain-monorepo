import { isUndefined } from '@voltz-protocol/commons-v2';
import { UpdateBatch, TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';
import { IrsVammPoolEntryUpdate } from '../specific';

export const updateIrsVammPoolEntry = (
  environmentV2Tag: string,
  id: string,
  update: IrsVammPoolEntryUpdate,
): UpdateBatch => {
  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.irs_vamm_pools,
  );

  const updates: string[] = [];
  if (!isUndefined(update.rateOracle)) {
    updates.push(`rateOracle="${update.rateOracle}"`);
  }

  if (!isUndefined(update.spread)) {
    updates.push(`spread=${update.spread}`);
  }

  if (!isUndefined(update.priceImpactPhi)) {
    updates.push(`priceImpactPhi=${update.priceImpactPhi}`);
  }

  if (!isUndefined(update.priceImpactBeta)) {
    updates.push(`priceImpactBeta=${update.priceImpactBeta}`);
  }

  if (!isUndefined(update.minTick)) {
    updates.push(`minTick=${update.minTick}`);
  }

  if (!isUndefined(update.maxTick)) {
    updates.push(`maxTick=${update.maxTick}`);
  }

  if (!isUndefined(update.currentTick)) {
    updates.push(`currentTick=${update.currentTick}`);
  }

  if (updates.length === 0) {
    return [];
  }

  const sqlTransactionQuery = `UPDATE \`${tableName}\` SET ${updates.join(
    ',',
  )} WHERE id="${id}";
  `;

  return [sqlTransactionQuery];
};
