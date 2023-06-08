import { getBigQuery } from '../../client';
import { MarketEntry, tableName } from '../specific';

export const insertMarketEntry = async (entry: MarketEntry): Promise<void> => {
  const bigQuery = getBigQuery();

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
