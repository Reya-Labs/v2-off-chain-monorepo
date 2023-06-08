import { getBigQuery } from '../../client';
import { AccountOwnerUpdateEvent, mapRow } from '../specific';
import { getTableFullName } from '../../utils/getTableName';
import { TableType } from '../../types';

export const pullAccountOwnerUpdateEvent = async (
  id: string,
): Promise<AccountOwnerUpdateEvent | null> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(TableType.raw_account_owner_updates);

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE id="${id}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapRow(rows[0]);
};
