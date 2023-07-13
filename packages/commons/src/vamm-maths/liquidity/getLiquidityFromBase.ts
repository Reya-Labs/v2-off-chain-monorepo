import { tickToSqrtPrice } from '../ticks';

export const getLiquidityFromBase = (
  base: number,
  tickLower: number,
  tickUpper: number,
): number => {
  const sqrtPriceLow = tickToSqrtPrice(tickLower);
  const sqrtPriceHigh = tickToSqrtPrice(tickUpper);

  const liquidity = base * (sqrtPriceHigh - sqrtPriceLow);

  return liquidity;
};
