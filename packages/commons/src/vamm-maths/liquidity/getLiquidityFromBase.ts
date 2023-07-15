import { assert } from '../../assert';
import { tickToSqrtPrice } from '../ticks';

export const getLiquidityFromBase = (
  base: number,
  tickLower: number,
  tickUpper: number,
): number => {
  assert(
    tickLower < tickUpper,
    `Could not get liquidity between [${tickLower}, ${tickUpper}]`,
  );

  const sqrtPriceLow = tickToSqrtPrice(tickLower);
  const sqrtPriceHigh = tickToSqrtPrice(tickUpper);

  const liquidity = base / (sqrtPriceHigh - sqrtPriceLow);

  return liquidity;
};
