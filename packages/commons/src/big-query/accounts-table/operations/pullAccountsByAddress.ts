import { getBigQuery } from '../../client';
import { mapRow, AccountEntry, tableName } from '../specific';

export const pullAccountsByAddress = async (
  chainIds: number[],
  owner: string,
): Promise<AccountEntry[]> => {
  const bigQuery = getBigQuery();

  const sqlQuery = `
    SELECT * FROM \`${tableName}\`  
      WHERE chainId IN (${chainIds.join(',')}) AND owner="${owner}"
  `;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map(mapRow);
};
