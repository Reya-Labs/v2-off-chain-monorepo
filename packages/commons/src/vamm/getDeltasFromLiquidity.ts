import { tickToSqrtPrice } from './tickConversions';

export const getDeltasFromLiquidity = (
  liquidity: number,
  tickLower: number,
  tickUpper: number,
): {
  x: number; // x has sign of liquidity
  y: number; // y has sign of liquidity
} => {
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
