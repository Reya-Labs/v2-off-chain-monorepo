import { getBigQuery } from '../../client';
import { getTableFullName } from '../../utils/getTableName';
import { TableType } from '../../types';
import { MarketEntry } from '../types';
import { mapToMarketEntry } from '../mapper';

export const pullMarketEntry = async (
  chainId: number,
  marketId: string,
): Promise<MarketEntry | null> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(TableType.markets);

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE chainId=${chainId} AND marketId="${marketId}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapToMarketEntry(rows[0]);
};
