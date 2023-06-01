import { getBigQuery } from '../../client';
import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { LiquidityIndexEntry } from '../types';

export const insertLiquidityIndex = async (
  entry: LiquidityIndexEntry,
): Promise<void> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(TableType.liquidity_indices);

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
