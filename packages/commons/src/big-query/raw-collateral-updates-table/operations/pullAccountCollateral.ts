import { getBigQuery } from '../../client';
import { tableName } from '../specific';

export type PullAccountCollateralResponse = {
  collateralType: string;
  balance: number;
}[];

export const pullAccountCollateral = async (
  chainId: number,
  accountId: string,
): Promise<PullAccountCollateralResponse> => {
  const bigQuery = getBigQuery();

  const sqlQuery = `SELECT SUM(collateralAmount) as balance, collateralType FROM \`${tableName}\` WHERE chainId=${chainId} AND accountId="${accountId}" GROUP BY collateralType`;
  console.log('sql query:', sqlQuery);

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  rows.sort((a, b) => b.balance - a.balance);

  return rows;
};
