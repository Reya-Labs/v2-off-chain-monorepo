import { getBigQuery } from '../../../global';
import { mapToBigQueryMintOrBurnRow } from '../../mappers';
import { BigQueryMintOrBurnRow } from '../../types';
import { getTableFullID } from '../../utils';

export const pullExistingMintOrBurnRow = async (
  eventId: string,
): Promise<BigQueryMintOrBurnRow | null> => {
  const bigQuery = getBigQuery();
  const sqlQuery = `SELECT * FROM \`${getTableFullID(
    'mints_and_burns',
  )}\` WHERE eventId="${eventId}"`;

  const options = {
    query: sqlQuery,
  };

  const [rows] = await bigQuery.query(options);

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapToBigQueryMintOrBurnRow(rows[0]);
};
