import { getBigQuery } from '../../client';
import { mapRow, PositionEntry } from '../specific';
import { tableName } from '../specific';

export const pullLpPositionEntries = async (
  chainId: number,
  marketId: string,
  maturityTimestamp: number,
): Promise<PositionEntry[]> => {
  const bigQuery = getBigQuery();

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE chainId=${chainId} AND marketId="${marketId}" AND maturityTimestamp=${maturityTimestamp} AND liquidityBalance>0`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map(mapRow);
};
