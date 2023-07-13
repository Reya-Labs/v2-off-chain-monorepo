import { getBigQuery } from '../../../client';
import { TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';
import { DepositedWithdrawnEvent, mapRow } from '../specific';

export const pullCollateralEventsByAccount = async (
  environmentV2Tag: string,
  chainId: number,
  accountId: string,
): Promise<DepositedWithdrawnEvent[]> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_deposited_withdrawn,
  );

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE chainId=${chainId} AND accountId="${accountId}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map(mapRow);
};
