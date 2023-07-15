import { assert } from '../../assert';
import { tickToSqrtPrice } from '../ticks';

export const getDeltasFromLiquidity = (
  liquidity: number,
  tickLower: number,
  tickUpper: number,
): {
  x: number; // x has sign of liquidity
  y: number; // y has sign of liquidity
} => {
  assert(
    tickLower < tickUpper,
    `Could not get liquidity between [${tickLower}, ${tickUpper}]`,
  );

  const sqrtPriceLow = tickToSqrtPrice(tickLower);
  const sqrtPriceHigh = tickToSqrtPrice(tickUpper);

  const x = liquidity * (sqrtPriceHigh - sqrtPriceLow);
  const y =
    (liquidity * (sqrtPriceHigh - sqrtPriceLow)) / sqrtPriceHigh / sqrtPriceLow;

  return {
    x,
    y,
  };
};
