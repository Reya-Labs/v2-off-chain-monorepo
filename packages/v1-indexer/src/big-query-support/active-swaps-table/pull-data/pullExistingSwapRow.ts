import { getBigQuery } from '../../../global';
import { mapToBigQuerySwapRow } from '../../mappers';
import { BigQuerySwapRow } from '../../types';
import { TableType, getTableFullID } from '../../utils';

export const pullExistingSwapRow = async (
  eventId: string,
): Promise<BigQuerySwapRow | null> => {
  const bigQuery = getBigQuery();

  const sqlQuery = `SELECT * FROM \`${getTableFullID(
    TableType.active_swaps,
  )}\` WHERE eventId="${eventId}"`;

  const options = {
    query: sqlQuery,
  };

  const [rows] = await bigQuery.query(options);

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapToBigQuerySwapRow(rows[0]);
};
