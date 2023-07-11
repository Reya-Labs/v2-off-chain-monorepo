import { getBigQuery } from '../../client';
import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { TakerOrderEvent, mapRow } from '../specific';

export const pullTakerOrderEvent = async (
  environmentV2Tag: string,
  id: string,
): Promise<TakerOrderEvent | null> => {
  const bigQuery = getBigQuery();

  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_taker_order,
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
