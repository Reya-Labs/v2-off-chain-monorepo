import { getBigQuery } from '../../../global';
import { mapToBigQueryMarginUpdatesRow } from '../../mappers';
import { BigQueryMarginUpdateRow } from '../../types';
import { getTableFullID } from '../../utils';

export const pullExistingMarginUpdateRow = async (
  eventId: string,
): Promise<BigQueryMarginUpdateRow | null> => {
  const bigQuery = getBigQuery();

  const sqlQuery = `SELECT * FROM \`${getTableFullID(
    'margin_updates',
  )}\` WHERE eventId="${eventId}"`;

  const options = {
    query: sqlQuery,
  };

  const [rows] = await bigQuery.query(options);

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapToBigQueryMarginUpdatesRow(rows[0]);
};
