import { getBigQuery } from '../../client';
import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { MarketEntry } from '../types';

export const insertMarketEntry = async (entry: MarketEntry): Promise<void> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(TableType.markets);

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

  const options = {
    query: sqlTransactionQuery,
    timeoutMs: 100000,
    useLegacySql: false,
  };

  await bigQuery.query(options);
};
