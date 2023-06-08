import { getBigQuery } from '../../client';
import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';

export type PullAccountCollateralResponse = {
  collateralType: string;
  balance: number;
}[];

export const pullAccountCollateral = async (
  chainId: number,
  accountId: string,
): Promise<PullAccountCollateralResponse> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(TableType.raw_collateral_updates);

  const sqlQuery = `SELECT SUM(collateralAmount) as balance, collateralType FROM \`${tableName}\` WHERE chainId=${chainId} AND accountId=${accountId} GROUP BY collateralType`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  rows.sort((a, b) => b.balance - a.balance);

  return rows;
};
