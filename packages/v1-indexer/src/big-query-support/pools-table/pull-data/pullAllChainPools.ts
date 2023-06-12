import { getBigQuery } from '../../../global';
import { mapToBigQueryPoolRow } from '../../mappers';
import { BigQueryPoolRow } from '../../types';
import { TableType, getTableFullID } from '../../utils';

export const pullAllChainPools = async (
  chainIds: number[],
): Promise<BigQueryPoolRow[]> => {
  const bigQuery = getBigQuery();

  const sqlQuery = `SELECT * FROM \`${getTableFullID(
    TableType.pools,
  )}\` WHERE (chainId IN (${chainIds.join(',')}))`;

  const options = {
    query: sqlQuery,
  };

  const [rows] = await bigQuery.query(options);

  if (!rows) {
    return [];
  }

  return rows.map(mapToBigQueryPoolRow);
};
