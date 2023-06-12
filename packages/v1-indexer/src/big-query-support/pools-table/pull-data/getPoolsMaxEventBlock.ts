/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { getBigQuery } from '../../../global';
import { TableType, getTableFullID } from '../../utils';

/**
 Get maximum event block number per chain
 */
export const getPoolsMaxEventBlock = async (
  chainId: number,
): Promise<number | null> => {
  const bigQuery = getBigQuery();

  const volumeQuery = `
    SELECT MAX(deploymentBlockNumber) as amount
      FROM \`${getTableFullID(TableType.pools)}\`
      WHERE chainId=${chainId};
  `;

  const options = {
    query: volumeQuery,
  };

  const [rows] = await bigQuery.query(options);

  if (!rows || rows.length === 0 || !rows[0].amount) {
    return null;
  }

  return rows[0].amount as number;
};
