import { Address } from '@voltz-protocol/commons-v2';
import { LiquidityIndexEntry, mapRow } from '../specific';
import { getBigQuery } from '../../client';
import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';

export const pullLiquidityIndicesByRateOracle = async (
  environmentV2Tag: string,
  chainId: number,
  oracleAddress: Address,
  fromSeconds: number,
  toSeconds: number,
  intervalSeconds: number,
): Promise<LiquidityIndexEntry[]> => {
  const bigQuery = getBigQuery();

  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.liquidity_indices,
  );

  const sqlQuery = `
    SELECT *
        FROM (
            SELECT *, LAG(blockTimestamp) OVER (ORDER BY blockTimestamp) AS previous_timestamp
            FROM \`${tableName}\`
            WHERE chainId=${chainId} AND 
                  oracleAddress="${oracleAddress}" AND
                  blockTimestamp >= ${fromSeconds} AND
                  blockTimestamp <= ${toSeconds}
        ) AS subquery
        WHERE blockTimestamp - previous_timestamp >= ${intervalSeconds}; 
    `;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map(mapRow);
};
