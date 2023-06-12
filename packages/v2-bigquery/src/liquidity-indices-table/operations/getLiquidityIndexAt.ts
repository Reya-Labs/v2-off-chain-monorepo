import { getBigQuery } from '../../client';
import { ethers } from 'ethers';
import { mapRow, LiquidityIndexEntry, tableName } from '../specific';
import { Address, scale, descale } from '@voltz-protocol/commons-v2';

export async function getLiquidityIndexAt(
  chainId: number,
  rateOracle: Address,
  targetTimestamp: number,
): Promise<number | null> {
  const closestIndices = await pullClosestIndices(
    chainId,
    rateOracle,
    targetTimestamp,
  );

  if (!closestIndices || closestIndices?.length != 2) {
    if (
      closestIndices?.length === 1 &&
      closestIndices[0].blockTimestamp === targetTimestamp
    ) {
      return closestIndices[0].liquidityIndex;
    }
    return null;
  }

  const [before, after] = closestIndices.sort(
    (a, b) => a.blockTimestamp - b.blockTimestamp,
  );

  const scaleWad = scale(18);
  const descaleWad = descale(18);

  const fromToIndexDelta = scaleWad(after.liquidityIndex).sub(
    scaleWad(before.liquidityIndex),
  );
  const fromToTimeDelta = ethers.BigNumber.from(
    after.blockTimestamp - before.blockTimestamp,
  );
  const fromTargetTimeDelta = ethers.BigNumber.from(
    targetTimestamp - before.blockTimestamp,
  );

  const targetIndex = fromToIndexDelta
    .mul(fromTargetTimeDelta)
    .div(fromToTimeDelta)
    .add(scaleWad(before.liquidityIndex));

  return descaleWad(targetIndex);
}

/**
 * @dev This query returns a single row if target timestamp is found in the table OR
 * if it's before the earliest observation of after the latest.
 * Otherwise, it returns two rows if the target timestamp <= max(timestamp) and
 * timestamp >= min(timestamp).
 */
const pullClosestIndices = async (
  chainId: number,
  rateOracle: Address,
  targetTimestamp: number,
): Promise<LiquidityIndexEntry[] | null> => {
  const bigQuery = getBigQuery();

  const sqlQuery = `
      WITH timestampBefore as (
          SELECT min(${targetTimestamp} - blockTimestamp) AS before
          FROM \`${tableName}\` 
          WHERE blockTimestamp <= ${targetTimestamp} AND chainId=${chainId} AND oracleAddress="${rateOracle}"
      ),

      timestampAfter as (
          SELECT min(blockTimestamp - ${targetTimestamp}) AS after
          FROM \`${tableName}\` 
          WHERE blockTimestamp >= ${targetTimestamp} AND chainId=${chainId} AND oracleAddress="${rateOracle}"
      )
      
      SELECT DISTINCT blockTimestamp, blockNumber, chainId, oracleAddress, liquidityIndex
      FROM \`${tableName}\`
      WHERE chainId=${chainId} AND oracleAddress="${rateOracle}" AND
          ( blockTimestamp = ${targetTimestamp} - (SELECT * FROM timestampBefore) OR
          blockTimestamp = ${targetTimestamp} + (SELECT * FROM timestampAfter) )
      `;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return null;
  }

  return rows.map(mapRow);
};
