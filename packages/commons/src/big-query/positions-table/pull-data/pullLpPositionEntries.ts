import { getBigQuery } from '../../client';
import { getTableFullName } from '../../utils/getTableName';
import { TableType } from '../../types';
import { PositionEntry } from '../types';
import { mapToPositionEntry } from '../mapper';

export const pullLpPositionEntries = async (
  chainId: number,
  marketId: string,
  maturityTimestamp: number,
): Promise<PositionEntry[]> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(TableType.positions);

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE chainId=${chainId} AND marketId="${marketId}" AND maturityTimestamp=${maturityTimestamp} AND liquidityBalance>0`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map(mapToPositionEntry);
};
