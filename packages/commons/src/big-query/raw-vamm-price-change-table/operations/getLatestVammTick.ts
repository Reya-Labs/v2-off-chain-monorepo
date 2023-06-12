import { getBigQuery } from '../../client';
import { tableName, mapRow } from '../specific';

/**
 Get latest tick of VAMM
 */
export const getLatestVammTick = async (
  chainId: number,
  marketId: string,
  maturityTimestamp: number,
): Promise<number | null> => {
  const bigQuery = getBigQuery();

  const condition = `chainId=${chainId} AND marketId="${marketId}" AND maturityTimestamp=${maturityTimestamp}`;

  const volumeQuery = `
    SELECT * FROM \`${tableName}\` WHERE (
        ${condition} AND blockNumber = (
            SELECT MAX(blockNumber) FROM \`${tableName}\` WHERE ${condition}
        )
    );
  `;

  const options = {
    query: volumeQuery,
  };

  const [rows] = await bigQuery.query(options);

  if (!rows || rows.length === 0) {
    return null;
  }

  // all the price changes in the last block -- expect very few entries
  const entries = rows.map(mapRow);

  // sort them by log index to get the latest entry in the block
  entries.sort((a, b) => b.logIndex - a.logIndex);

  return entries[0].tick;
};
