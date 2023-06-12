const BASE = 1.0001;

export const tickToSqrtPrice = (tick: number): number => {
  const sqrtPrice = BASE ** (tick / 2);
  return sqrtPrice;
};

export const tickToFixedRate = (tick: number): number => {
  const fixedRate = Math.pow(1.0001, -tick) / 100;
  return fixedRate;
};
