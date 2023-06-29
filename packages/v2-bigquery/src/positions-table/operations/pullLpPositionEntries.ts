import { getBigQuery } from '../../client';
import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { mapRow, PositionEntry } from '../specific';

export const pullLpPositionEntries = async (
  environmentV2Tag: string,
  chainId: number,
  marketId: string,
  maturityTimestamp: number,
): Promise<PositionEntry[]> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(environmentV2Tag, TableType.positions);

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE chainId=${chainId} AND marketId="${marketId}" AND maturityTimestamp=${maturityTimestamp} AND liquidity>0`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map(mapRow);
};
