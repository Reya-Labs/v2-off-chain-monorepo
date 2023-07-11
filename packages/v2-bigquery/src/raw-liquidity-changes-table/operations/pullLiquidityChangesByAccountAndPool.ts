import { getBigQuery } from '../../client';
import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { LiquidityChangeEvent, mapRow } from '../specific';

export const pullLiquidityChangesByAccountAndPool = async (
  environmentV2Tag: string,
  chainId: number,
  accountId: string,
  marketId: string,
  maturityTimestamp: number,
): Promise<LiquidityChangeEvent[]> => {
  const bigQuery = getBigQuery();

  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_liquidity_change,
  );

  const sqlQuery = `
    SELECT * FROM \`${tableName}\` 
      WHERE accountId="${accountId}" AND 
            chainId=${chainId} AND 
            marketId="${marketId}" AND 
            maturityTimestamp=${maturityTimestamp};`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map(mapRow);
};
