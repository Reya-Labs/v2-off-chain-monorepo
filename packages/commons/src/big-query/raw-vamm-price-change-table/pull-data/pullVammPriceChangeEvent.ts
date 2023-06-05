import { VammPriceChangeEvent } from '../../../utils/eventTypes';
import { getBigQuery } from '../../client';
import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { mapToVammPriceChangeEvent } from '../mapper';

export const pullVammPriceChangeEvent = async (
  id: string,
): Promise<VammPriceChangeEvent | null> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(TableType.raw_vamm_created);

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE id="${id}"`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapToVammPriceChangeEvent(rows[0]);
};
