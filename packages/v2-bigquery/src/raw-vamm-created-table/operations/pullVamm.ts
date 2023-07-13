import { getBigQuery } from '../../client';
import { VammCreatedEvent, mapRow } from '../specific';
import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';

export const pullVamm = async (
  environmentV2Tag: string,
  chainId: number,
  marketId: string,
  maturityTimestamp: number,
): Promise<VammCreatedEvent | null> => {
  const bigQuery = getBigQuery();
  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_vamm_created,
  );

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE chainId=${chainId} AND marketId="${marketId}" AND maturityTimestamp=${maturityTimestamp}`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapRow(rows[0]);
};
