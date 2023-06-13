import { getBigQuery } from '../../client';
import { ethers } from 'ethers';
import { mapRow, LiquidityIndexEntry, tableName } from '../specific';
import { Address, scale, descale } from '@voltz-protocol/commons-v2';

export async function getLiquidityIndexAt(
  chainId: number,
  rateOracle: Address,
  targetTimestamp: number,
): Promise<number | null> {
  const [inLeft, inRight] = await pullClosestDatapoints(
    chainId,
    rateOracle,
    targetTimestamp,
  );

  // Check if there's right target
  for (const datapoint of inLeft) {
    if (datapoint.blockTimestamp === targetTimestamp) {
      return datapoint.liquidityIndex;
    }
  }

  // Check if there are enough datapoints to interpolate in the middle
  if (inLeft.length >= 1 && inRight.length >= 1) {
    return interpolate(inLeft[inLeft.length - 1], inRight[0], targetTimestamp);
  }

  if (inLeft.length >= 2) {
    return interpolate(
      inLeft[inLeft.length - 2],
      inLeft[inLeft.length - 1],
      targetTimestamp,
    );
  }

  if (inRight.length >= 2) {
    return interpolate(inRight[0], inRight[1], targetTimestamp);
  }

  return null;
}

// Get 2 data points before timestamp and 2 data points after timestamp
const pullClosestDatapoints = async (
  chainId: number,
  rateOracle: Address,
  targetTimestamp: number, // in seconds
): Promise<[LiquidityIndexEntry[], LiquidityIndexEntry[]]> => {
  const bigQuery = getBigQuery();

  const idCondition = `chainId=${chainId} AND oracleAddress="${rateOracle}"`;

  const sqlQuery = `
    (
      SELECT * FROM \`${tableName}\` WHERE ${idCondition} AND blockTimestamp<=${targetTimestamp}
      ORDER BY blockTimestamp DESC
      LIMIT 2
    )
    UNION ALL
    (
      SELECT * FROM \`${tableName}\` WHERE ${idCondition} AND blockTimestamp>${targetTimestamp}
      ORDER BY blockTimestamp ASC
      LIMIT 2
    );
  `;

  const [rows] = await bigQuery.query({
    query: sqlQuery,
  });

  if (!rows || rows.length === 0) {
    return [[], []];
  }

  const allDatapoints = rows.map(mapRow);

  const inLeft = allDatapoints
    .filter((d) => d.blockTimestamp <= targetTimestamp)
    .sort((a, b) => a.blockTimestamp - b.blockTimestamp);

  const inRight = allDatapoints
    .filter((d) => d.blockTimestamp > targetTimestamp)
    .sort((a, b) => a.blockTimestamp - b.blockTimestamp);

  return [inLeft, inRight];
};

// todo: check if scaling to wad is needed below
const interpolate = (
  before: LiquidityIndexEntry,
  after: LiquidityIndexEntry,
  targetTimestamp: number,
): number => {
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
};
