import { getBigQuery } from '../../../client';
import { TableType } from '../../../types';
import { bqNumericToNumber } from '../../../utils/converters';
import { getTableFullName } from '../../../table-infra/getTableName';

export type PullAccountCollateralResponse = {
  collateralType: string;
  balance: number;
}[];

export const pullAccountCollateral = async (
  environmentV2Tag: string,
  chainId: number,
  accountId: string,
): Promise<PullAccountCollateralResponse> => {
  const bigQuery = getBigQuery();

  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_collateral_updates,
  );

  const sqlQuery = `SELECT SUM(collateralAmount) as balance, collateralType FROM \`${tableName}\` WHERE chainId=${chainId} AND accountId="${accountId}" GROUP BY collateralType`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  const entries = rows.map((r) => ({
    balance: bqNumericToNumber(r.balance),
    collateralType: r.collateralAmount as string,
  }));

  entries.sort((a, b) => b.balance - a.balance);

  return entries;
};
