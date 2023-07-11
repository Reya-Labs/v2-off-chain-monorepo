import { getBigQuery } from '../../client';
import { TableType } from '../../types';
import { getTableFullName } from '../../utils/getTableName';
import { DatedIRSPositionSettledEvent, mapRow } from '../specific';

export const pullDatedIRSPositionSettledEventsByAccountAndPool = async (
  environmentV2Tag: string,
  chainId: number,
  accountId: string,
  marketId: string,
  maturityTimestamp: number,
): Promise<DatedIRSPositionSettledEvent[]> => {
  const bigQuery = getBigQuery();

  const tableName = getTableFullName(
    environmentV2Tag,
    TableType.raw_dated_irs_position_settled,
  );

  const sqlQuery = `
    SELECT * FROM \`${tableName}\` 
      WHERE accountId="${accountId}" AND 
            chainId=${chainId} AND 
            marketId="${marketId}" AND 
            maturityTimestamp=${maturityTimestamp};`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map(mapRow);
};
