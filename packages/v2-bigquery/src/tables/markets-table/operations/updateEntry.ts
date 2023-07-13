import { isUndefined } from '@voltz-protocol/commons-v2';
import { MarketEntryUpdate } from '../specific';
import { TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';
import { UpdateBatch } from '../../../types';

export const updateMarketEntry = (
  environmentV2Tag: string,
  chainId: number,
  marketId: string,
  update: MarketEntryUpdate,
): UpdateBatch => {
  const tableName = getTableFullName(environmentV2Tag, TableType.markets);

  const updates: string[] = [];
  if (!isUndefined(update.quoteToken)) {
    updates.push(`quoteToken="${update.quoteToken}"`);
  }

  if (!isUndefined(update.oracleAddress)) {
    updates.push(`oracleAddress="${update.oracleAddress}"`);
  }

  if (!isUndefined(update.feeCollectorAccountId)) {
    updates.push(`feeCollectorAccountId="${update.feeCollectorAccountId}"`);
  }

  if (!isUndefined(update.atomicMakerFee)) {
    updates.push(`atomicMakerFee=${update.atomicMakerFee}`);
  }

  if (!isUndefined(update.atomicTakerFee)) {
    updates.push(`atomicTakerFee=${update.atomicTakerFee}`);
  }

  if (updates.length === 0) {
    return [];
  }

  const sqlTransactionQuery = `
    UPDATE \`${tableName}\`
      SET ${updates.join(',')}
      WHERE chainId=${chainId} AND marketId="${marketId}";
  `;

  return [sqlTransactionQuery];
};
