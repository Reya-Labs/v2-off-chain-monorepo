import { getBigQuery } from '../../../client';
import { TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';
import { TakerOrderEvent, mapRow } from '../specific';

export const pullTakerOrdersByAccountAndPool = async (
  environmentV2Tag: string,
  chainId: number,
  accountId: string,
  marketId: string,
  maturityTimestamp: number,
): Promise<TakerOrderEvent[]> => {
  const bigQuery = getBigQuery();

  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_taker_order,
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
