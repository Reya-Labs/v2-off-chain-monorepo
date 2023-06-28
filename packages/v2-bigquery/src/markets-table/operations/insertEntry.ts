import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { UpdateBatch } from '../../types';
import { MarketEntry } from '../specific';

export const insertMarketEntry = (
  environmentV2Tag: string,
  entry: MarketEntry,
): UpdateBatch => {
  const tableName = getTableFullName(environmentV2Tag, TableType.markets);

  const row = `
    ${entry.chainId},
    "${entry.marketId}",
    "${entry.quoteToken}",
    "${entry.oracleAddress}",
    "${entry.feeCollectorAccountId}",
    ${entry.atomicMakerFee},
    ${entry.atomicTakerFee}
  `;

  // build and fire sql query
  const sqlTransactionQuery = `INSERT INTO \`${tableName}\` VALUES (${row});`;

  return [sqlTransactionQuery];
};
