import { getBigQuery } from '../../../client';
import { TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';
import { mapRow, AccountEntry } from '../specific';
import { Address } from '@voltz-protocol/commons-v2';

export const pullAccountsByAddress = async (
  environmentV2Tag: string,
  chainIds: number[],
  owner: Address,
): Promise<AccountEntry[]> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(environmentV2Tag, TableType.accounts);

  const sqlQuery = `
    SELECT * FROM \`${tableName}\`  
      WHERE chainId IN (${chainIds.join(',')}) 
            AND owner="${owner}";
  `;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map(mapRow);
};
