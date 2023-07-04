import { getBigQuery } from '../../../global';
import { getTableFullID, TableType, bqNumericToNumber } from '../../utils';

export const getNotionalInRange = async (
  chainId: number,
  vammAddress: string,
  a: number,
  b: number,
): Promise<number> => {
  if (a >= b) {
    return 0;
  }

  const bigQuery = getBigQuery();
  const tableName = getTableFullID(TableType.positions);

  const sqlQuery = `
    SELECT 
      SUM(
        liquidity * 
          (
            POW(1.0001, IF(tickUpper < ${b}, tickUpper, ${b}) / 2) - 
            POW(1.0001, IF(tickLower > ${a}, tickLower, ${a}) / 2)
          )
      ) as amount
    FROM \`${tableName}\` 
    WHERE chainId=${chainId} AND 
          vammAddress="${vammAddress}" AND 
          ${a} < tickUpper AND
          tickLower < ${b};
  `;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0 || !rows[0].amount) {
    return 0;
  }

  return bqNumericToNumber(rows[0].amount);
};
