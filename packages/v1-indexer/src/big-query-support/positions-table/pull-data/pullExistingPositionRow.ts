import { getBigQuery } from '../../../global';
import { mapToBigQueryPositionRow } from '../../mappers';
import { BigQueryPositionRow } from '../../types';
import { getTableFullID } from '../../utils';

export const pullExistingPositionRow = async (
  chainId: number,
  vammAddress: string,
  recipient: string,
  tickLower: number,
  tickUpper: number,
): Promise<BigQueryPositionRow | null> => {
  const bigQuery = getBigQuery();

  const sqlQuery = `
    SELECT * FROM \`${getTableFullID('positions')}\` 
      WHERE chainId=${chainId} AND
            vammAddress="${vammAddress}" AND 
            ownerAddress="${recipient}" AND 
            tickLower=${tickLower} AND 
            tickUpper=${tickUpper}
  `;

  const options = {
    query: sqlQuery,
  };

  const [rows] = await bigQuery.query(options);

  if (!rows || rows.length === 0) {
    return null;
  }

  // todo: operations like this one need validation
  return mapToBigQueryPositionRow(rows[0]);
};
