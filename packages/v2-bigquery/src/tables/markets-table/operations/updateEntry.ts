import { MarketEntryUpdate } from '../specific';
import { TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';
import { UpdateBatch } from '../../../types';

export const updateMarketEntry = (
  environmentV2Tag: string,
  chainId: number,
  marketId: string,
  {
    quoteToken,
    oracleAddress,
    feeCollectorAccountId,
    atomicMakerFee,
    atomicTakerFee,
  }: MarketEntryUpdate,
): UpdateBatch => {
  const tableName = getTableFullName(environmentV2Tag, TableType.markets);

  const updates: string[] = [];
  if (quoteToken !== undefined) {
    updates.push(`quoteToken="${quoteToken}"`);
  }

  if (oracleAddress !== undefined) {
    updates.push(`oracleAddress="${oracleAddress}"`);
  }

  if (feeCollectorAccountId !== undefined) {
    updates.push(`feeCollectorAccountId="${feeCollectorAccountId}"`);
  }

  if (atomicMakerFee !== undefined) {
    updates.push(`atomicMakerFee=${atomicMakerFee}`);
  }

  if (atomicTakerFee !== undefined) {
    updates.push(`atomicTakerFee=${atomicTakerFee}`);
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
