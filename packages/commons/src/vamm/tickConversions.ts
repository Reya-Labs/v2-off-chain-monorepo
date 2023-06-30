const BASE = 1.0001;

export const tickToSqrtPrice = (tick: number): number => {
  const sqrtPrice = BASE ** (tick / 2);
  return sqrtPrice;
};

export const tickToFixedRate = (tick: number): number => {
  const fixedRate = Math.pow(BASE, -tick) / 100;
  return fixedRate;
};

export const fixedRateToTick = (fixedRate: number): number => {
  const tick = Math.floor(-Math.log(fixedRate * 100) / Math.log(BASE));

  return tick;
};

export const fixedRateToSpacedTick = (
  fixedRate: number,
  tickSpacing: number,
): number => {
  const tick = fixedRateToTick(fixedRate);

  return Math.floor(tick / tickSpacing) * tickSpacing;
};
