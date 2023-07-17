import { getBigQuery } from '../../../client';
import { TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';
import { IrsVammPoolEntry, mapRow } from '../specific';

export const pullIrsVammPoolEntriesByChains = async (
  environmentV2Tag: string,
  chainIds: number[],
): Promise<IrsVammPoolEntry[]> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_vamm_created,
  );

  const cond = `chainId IN (${chainIds.join(',')})`;
  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE ${cond};`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map(mapRow);
};
