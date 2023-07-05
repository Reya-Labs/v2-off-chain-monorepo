import { getDeltasFromLiquidity } from './getDeltasFromLiquidity';

export type GetLPInfoInRangeResponse = {
  base: number; // the amount of available base for traders
  avgFix: number;
};

export const getLpInfoInRange = (
  lpPositions: {
    liquidity: number;
    tickLower: number;
    tickUpper: number;
  }[],
  currentTick: number,
  toTick: number,
): GetLPInfoInRangeResponse => {
  if (currentTick === toTick) {
    return {
      base: 0,
      avgFix: 0,
    };
  }

  if (currentTick > toTick) {
    // current tick > to tick: tick decreases -> traders take VT

    const result = getLpInfoInRange(lpPositions, toTick, currentTick);
    return {
      base: -result.base,
      avgFix: result.avgFix,
    };
  }

  const sums = [0, 0];

  // current tick < to tick: tick increases -> traders take FT
  lpPositions.forEach((p) => {
    if (p.tickUpper <= currentTick || toTick <= p.tickLower) {
      return;
    }

    const c = Math.max(p.tickLower, currentTick);
    const d = Math.min(p.tickUpper, toTick);

    const { x, y } = getDeltasFromLiquidity(p.liquidity, c, d);

    sums[0] += x;
    sums[1] += y;
  });

  return {
    base: -sums[0],
    avgFix: sums[0] === 0 ? 0 : sums[1] / sums[0],
  };
};
