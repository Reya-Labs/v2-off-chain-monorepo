import { Address } from '@voltz-protocol/commons-v2';
import { getBigQuery } from '../../../client';
import { LiquidityIndexEntry } from '../specific';
import { mapRow } from '../specific';
import { TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';

export const pullLiquidityIndices = async (
  environmentV2Tag: string,
  chainId: number,
  oracleAddress: Address,
): Promise<LiquidityIndexEntry[]> => {
  const bigQuery = getBigQuery();

  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.liquidity_indices,
  );

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE chainId=${chainId} AND oracleAddress="${oracleAddress}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map(mapRow);
};
