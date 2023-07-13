import { getBigQuery } from '../../../client';
import { TableType } from '../../../types';
import { getTableFullName } from '../../../table-infra/getTableName';
import { mapRow } from '../specific';

/**
 Get tick at some given timestamp of VAMM
 */
export const getTickAtTimestamp = async (
  environmentV2Tag: string,
  chainId: number,
  marketId: string,
  maturityTimestamp: number,
  timestamp: number, // in seconds
): Promise<number | null> => {
  const bigQuery = getBigQuery();

  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_vamm_price_change,
  );
  const condition = `chainId=${chainId} AND marketId="${marketId}" AND maturityTimestamp=${maturityTimestamp} AND blockTimestamp<=${timestamp}`;

  const sqlQuery = `
    SELECT * FROM \`${tableName}\` WHERE ${condition}
    ORDER BY blockTimestamp DESC
    LIMIT 1;
  `;

  const options = {
    query: sqlQuery,
  };

  const [rows] = await bigQuery.query(options);

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapRow(rows[0]).tick;
};
