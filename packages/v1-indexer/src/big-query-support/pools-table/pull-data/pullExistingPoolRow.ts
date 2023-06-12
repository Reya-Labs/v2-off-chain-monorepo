import { getBigQuery } from '../../../global';
import { mapToBigQueryPoolRow } from '../../mappers';
import { BigQueryPoolRow } from '../../types';
import { TableType, getTableFullID } from '../../utils';

export const pullExistingPoolRow = async (
  vammAddress: string,
  chainId: number,
): Promise<BigQueryPoolRow | null> => {
  const bigQuery = getBigQuery();

  const sqlQuery = `SELECT * FROM \`${getTableFullID(
    TableType.pools,
  )}\` WHERE vamm="${vammAddress}" AND chainId=${chainId}`;

  const options = {
    query: sqlQuery,
  };

  const [rows] = await bigQuery.query(options);

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapToBigQueryPoolRow(rows[0]);
};
