import { getBigQuery } from '../../../global';
import { getTableFullID, TableType, bqNumericToNumber } from '../../utils';

export const getNotionalInRange = async (
  chainId: number,
  vammAddress: string,
  tickLower: number,
  tickUpper: number,
): Promise<number> => {
  if (tickLower >= tickUpper) {
    return 0;
  }

  const bigQuery = getBigQuery();
  const tableName = getTableFullID(TableType.positions);

  const sqlQuery = `
    SELECT 
      SUM(
        liquidity * 
          (
            POW(1.0001, IF(tickUpper < ${tickUpper}, tickUpper, ${tickUpper}) / 2) - 
            POW(1.0001, IF(tickLower > ${tickLower}, tickLower, ${tickLower}) / 2)
          )
      ) as amount
    FROM \`${tableName}\` 
    WHERE chainId=${chainId} AND 
          vammAddress="${vammAddress}";
  `;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return 0;
  }

  return bqNumericToNumber(rows[0].amount);
};
