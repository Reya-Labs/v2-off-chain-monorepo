import { VammCreatedEvent } from '../../../../event-parsers/types';
import { getBigQuery } from '../../client';
import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { mapToVammCreatedEvent } from '../mapper';

export const pullVammCreatedEvent = async (
  id: string,
): Promise<VammCreatedEvent | null> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(TableType.raw_vamm_created);

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE id="${id}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapToVammCreatedEvent(rows[0]);
};