import { getBigQuery } from '../../client';
import { getTableFullName } from '../../utils/getTableName';
import { TableType } from '../../types';
import { Address } from '../../../utils/convertLowercase';

export type LiquidityIndexEntry = {
    chainId: number;
    rateOracle: Address,
    liquidityIndex: number,
    blockTimestamp: number
}

const mapToLiquidityIndices = (row: any) : LiquidityIndexEntry => row;

export const pullClosestIndices = async (
  chainId: number,
  rateOracle: Address,
  targetTimestamp: number
): Promise<LiquidityIndexEntry[] | null> => {
  const bigQuery = getBigQuery();
  const liquidityIndexTableName = getTableFullName(TableType.liquidity_indices);

  const sqlQuery = `
    WITH timestampBefore as (
        SELECT min(${targetTimestamp} - blockTimestamp) AS before
        FROM \`${liquidityIndexTableName}\` 
        WHERE blockTimestamp <= ${targetTimestamp} AND chainId=${chainId} AND oracleAddress="${rateOracle}"
    ),

    timestampAfter as (
        SELECT min(blockTimestamp - ${targetTimestamp}) AS after
        FROM \`${liquidityIndexTableName}\` 
        WHERE blockTimestamp >= ${targetTimestamp} AND chainId=${chainId} AND oracleAddress="${rateOracle}"
    )
    
    SELECT blockTimestamp, chainId, oracleAddress as rateOracle, liquidityIndex
    FROM \`${liquidityIndexTableName}\`
    WHERE chainId=${chainId} AND oracleAddress="${rateOracle}" AND blockTimestamp = ${targetTimestamp} - (SELECT * FROM timestampBefore)
    UNION ALL
    SELECT blockTimestamp, chainId, oracleAddress as rateOracle, liquidityIndex
    FROM \`${liquidityIndexTableName}\`
    WHERE chainId=${chainId} AND oracleAddress="${rateOracle}" AND blockTimestamp = ${targetTimestamp} + (SELECT * FROM timestampAfter)
    `;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return rows.map(mapToLiquidityIndices);
};
