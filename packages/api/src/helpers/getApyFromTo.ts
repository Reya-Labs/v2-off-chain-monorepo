import {
  Address,
  descale,
  scale,
  SECONDS_IN_YEAR,
} from '@voltz-protocol/commons-v2';
import { pullClosestIndices } from '@voltz-protocol/commons-v2';
import { ethers } from 'ethers';

async function getLiquidityIndexAt(
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

export async function getApyFromTo(
  chainId: number,
  rateOracle: Address,
  fromTimestamp: number,
  toTimestamp: number,
): Promise<number | null> {
  const fromIndex = await getLiquidityIndexAt(
    chainId,
    rateOracle,
    fromTimestamp,
  );
  const toIndex = await getLiquidityIndexAt(chainId, rateOracle, toTimestamp);

  if (fromIndex === null || toIndex === null) {
    return null;
  }

  // note: only for compound oracles
  const timeFactor = SECONDS_IN_YEAR / (toTimestamp - fromTimestamp);
  const apy = (toIndex / fromIndex) ** timeFactor - 1;
  // if linear
  /*
        const targetIndex = (toIndex - fromIndex) * timeFactor;
    */

  return apy * 100;
}
