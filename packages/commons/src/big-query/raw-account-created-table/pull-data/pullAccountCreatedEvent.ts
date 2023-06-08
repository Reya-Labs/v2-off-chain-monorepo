import { AccountCreatedEvent } from '../../../utils/eventTypes';
import { getBigQuery } from '../../client';
import { mapToAccountCreatedEvent } from '../mapper';
import { getTableFullName } from '../../utils/getTableName';
import { TableType } from '../../types';

export const pullAccountCreatedEvent = async (
  id: string,
): Promise<AccountCreatedEvent | null> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(TableType.raw_account_created);

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE id="${id}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapToAccountCreatedEvent(rows[0]);
};
