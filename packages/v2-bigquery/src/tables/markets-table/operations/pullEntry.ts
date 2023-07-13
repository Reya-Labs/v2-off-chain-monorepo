import { getBigQuery } from '../../../client';
import { TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';
import { mapToMarketEntry, MarketEntry } from '../specific';

export const pullMarketEntry = async (
  environmentV2Tag: string,
  chainId: number,
  marketId: string,
): Promise<MarketEntry | null> => {
  const bigQuery = getBigQuery();

  const tableName = getTableFullName(environmentV2Tag, TableType.markets);

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE chainId=${chainId} AND marketId="${marketId}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapToMarketEntry(rows[0]);
};
