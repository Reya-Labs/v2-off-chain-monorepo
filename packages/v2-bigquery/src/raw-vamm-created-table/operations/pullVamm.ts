import { SupportedChainId } from '@voltz-protocol/commons-v2';
import { getBigQuery } from '../../client';
import { VammCreatedEvent, mapRow, tableName } from '../specific';

export const pullVamm = async (
  chainId: SupportedChainId,
  marketId: string,
  maturityTimestamp: number,
): Promise<VammCreatedEvent | null> => {
  const bigQuery = getBigQuery();

  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE chainId=${chainId} AND marketId="${marketId}" AND maturityTimestamp=${maturityTimestamp}`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return mapRow(rows[0]);
};
