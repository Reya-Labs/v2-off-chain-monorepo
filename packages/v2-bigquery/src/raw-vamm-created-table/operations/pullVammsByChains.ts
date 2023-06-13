import { SupportedChainId } from '@voltz-protocol/commons-v2';
import { getBigQuery } from '../../client';
import { VammCreatedEvent, mapRow, tableName } from '../specific';

export const pullVammsByChains = async (
  chainIds: SupportedChainId[],
): Promise<VammCreatedEvent[]> => {
  const bigQuery = getBigQuery();

  const cond = `chainId IN (${chainIds.join(',')})`;
  const sqlQuery = `SELECT * FROM \`${tableName}\` WHERE ${cond};`;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map(mapRow);
};
