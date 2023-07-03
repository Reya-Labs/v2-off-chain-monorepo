import { getBigQuery } from '../../client';
import { TableType } from '../../types';
import { bqNumericToNumber } from '../../utils/converters';
import { getTableFullName } from '../../utils/getTableName';

export const getBaseInRange = async (
  environmentV2Tag: string,
  chainId: number,
  marketId: string,
  maturityTimestamp: number,
  tickLower: number,
  tickUpper: number,
): Promise<number> => {
  if (tickLower >= tickUpper) {
    return 0;
  }

  const bigQuery = getBigQuery();

  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_liquidity_change,
  );

  const sqlQuery = `
    SELECT 
      SUM(
        liquidityDelta * 
          (
            POW(1.0001, IF(tickUpper < ${tickUpper}, tickUpper, ${tickUpper}) / 2) - 
            POW(1.0001, IF(tickLower > ${tickLower}, tickLower, ${tickLower}) / 2)
          )
      ) as amount
    FROM \`${tableName}\` 
    WHERE chainId=${chainId} AND 
          marketId="${marketId}" AND 
          maturityTimestamp=${maturityTimestamp};
  `;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return 0;
  }

  return bqNumericToNumber(rows[0].amount);
};
