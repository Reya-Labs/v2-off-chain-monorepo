import { getBigQuery } from '../../../client';
import { TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';
import { VammPriceChangeEvent, mapRow } from '../specific';

export const pullTicksByPool = async (
  environmentV2Tag: string,
  chainId: number,
  marketId: string,
  maturityTimestamp: number,
  fromTimestamp: number,
  toTimestamp: number,
): Promise<VammPriceChangeEvent[]> => {
  const bigQuery = getBigQuery();

  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_vamm_price_change,
  );

  const sqlQuery = `
    SELECT * FROM \`${tableName}\` 
      WHERE chainId=${chainId} AND 
            marketId="${marketId}" AND 
            maturityTimestamp=${maturityTimestamp} AND 
            ${fromTimestamp} <= blockTimestamp AND 
            blockTimestamp <= ${toTimestamp}`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map(mapRow);
};
