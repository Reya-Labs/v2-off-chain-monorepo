import { Address } from '@voltz-protocol/commons-v2';
import { getBigQuery } from '../../client';
import { LiquidityIndexEntry } from '../specific';
import { mapRow, tableName } from '../specific';

export const pullLiquidityIndices = async (
  chainId: number,
  oracleAddress: Address,
): Promise<LiquidityIndexEntry[]> => {
  const bigQuery = getBigQuery();

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE chain=${chainId} AND oracleAddress="${oracleAddress}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map(mapRow);
};
