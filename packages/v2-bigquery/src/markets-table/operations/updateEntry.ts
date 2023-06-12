import { isUndefined } from '@voltz-protocol/commons-v2';
import { getBigQuery } from '../../client';
import { MarketEntryUpdate, tableName } from '../specific';

export const updateMarketEntry = async (
  chainId: number,
  marketId: string,
  update: MarketEntryUpdate,
): Promise<void> => {
  const bigQuery = getBigQuery();

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
    return;
  }

  const sqlTransactionQuery = `
    UPDATE \`${tableName}\`
      SET ${updates.join(',')}
      WHERE chainId=${chainId} AND marketId="${marketId}";
  `;

  const options = {
    query: sqlTransactionQuery,
    timeoutMs: 100000,
    useLegacySql: false,
  };

  await bigQuery.query(options);
};
