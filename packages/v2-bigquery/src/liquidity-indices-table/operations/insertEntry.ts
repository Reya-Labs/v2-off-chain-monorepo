import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { UpdateBatch } from '../../types';
import { LiquidityIndexEntry } from '../specific';

export const insertLiquidityIndex = (
  environmentV2Tag: string,
  entry: LiquidityIndexEntry,
): UpdateBatch => {
  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.liquidity_indices,
  );

  const row = `
    ${entry.chainId},
    ${entry.blockNumber}, 
    ${entry.blockTimestamp}, 
    "${entry.oracleAddress}",
    ${entry.liquidityIndex}
  `;

  // build and fire sql query
  const sqlTransactionQuery = `INSERT INTO \`${tableName}\` VALUES (${row});`;

  return [sqlTransactionQuery];
};
