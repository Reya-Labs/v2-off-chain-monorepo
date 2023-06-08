import { getBigQuery } from '../../client';
import { LiquidityIndexEntry, tableName } from '../specific';

export const insertLiquidityIndex = async (
  entry: LiquidityIndexEntry,
): Promise<void> => {
  const bigQuery = getBigQuery();

  const row = `
    ${entry.chainId},
    ${entry.blockNumber}, 
    ${entry.blockTimestamp}, 
    "${entry.oracleAddress}",
    ${entry.liquidityIndex}
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
