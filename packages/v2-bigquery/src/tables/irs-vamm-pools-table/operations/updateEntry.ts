import { UpdateBatch, TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';
import { IrsVammPoolEntryUpdate } from '../specific';

export const updateIrsVammPoolEntry = (
  environmentV2Tag: string,
  id: string,
  {
    rateOracle,
    spread,
    priceImpactPhi,
    priceImpactBeta,
    minTick,
    maxTick,
    currentTick,
  }: IrsVammPoolEntryUpdate,
): UpdateBatch => {
  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.irs_vamm_pools,
  );

  const updates: string[] = [];
  if (rateOracle !== undefined) {
    updates.push(`rateOracle="${rateOracle}"`);
  }

  if (spread !== undefined) {
    updates.push(`spread=${spread}`);
  }

  if (priceImpactPhi !== undefined) {
    updates.push(`priceImpactPhi=${priceImpactPhi}`);
  }

  if (priceImpactBeta !== undefined) {
    updates.push(`priceImpactBeta=${priceImpactBeta}`);
  }

  if (minTick !== undefined) {
    updates.push(`minTick=${minTick}`);
  }

  if (maxTick !== undefined) {
    updates.push(`maxTick=${maxTick}`);
  }

  if (currentTick !== undefined) {
    updates.push(`currentTick=${currentTick}`);
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
