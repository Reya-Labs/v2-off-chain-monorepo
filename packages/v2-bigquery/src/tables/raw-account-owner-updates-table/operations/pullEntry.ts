import { getBigQuery } from '../../../client';
import { TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';
import { AccountOwnerUpdateEvent, mapRow } from '../specific';

export const pullAccountOwnerUpdateEvent = async (
  environmentV2Tag: string,
  id: string,
): Promise<AccountOwnerUpdateEvent | null> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_account_owner_updates,
  );

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE id="${id}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapRow(rows[0]);
};
