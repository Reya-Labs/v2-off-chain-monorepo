import { getBigQuery } from '../../client';
import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { LiquidationEvent, mapRow } from '../specific';

export const pullLiquidationsByAccount = async (
  environmentV2Tag: string,
  chainId: number,
  accountId: string,
): Promise<LiquidationEvent[]> => {
  const bigQuery = getBigQuery();

  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_liquidation,
  );

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE chainId=${chainId} AND liquidatedAccountId="${accountId}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map(mapRow);
};
